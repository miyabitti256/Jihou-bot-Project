import { db } from "@bot/lib/db";
import { logger } from "@bot/lib/logger";
import {
  getPurchaseCountToday,
  getUserInventory,
  purchaseItem,
  ShopError,
} from "@bot/services/shop/shop";
import { SHOP_ITEMS } from "@bot/services/shop/shop-items";
import { ensureUserExists } from "@bot/services/users/user";
import { users } from "@jihou/database";
import {
  ActionRowBuilder,
  type ChatInputCommandInteraction,
  ComponentType,
  EmbedBuilder,
  SlashCommandBuilder,
  StringSelectMenuBuilder,
} from "discord.js";
import { eq } from "drizzle-orm";

export const data = new SlashCommandBuilder()
  .setName("buy")
  .setDescription("ショップを開いてアイテムの購入を行います");

export async function execute(interaction: ChatInputCommandInteraction) {
  const userId = interaction.user.id;
  const username = interaction.user.username;

  // ユーザーの存在を保証
  await ensureUserExists(userId, username);

  // 初回データ取得とUI構築用の関数
  const getShopState = async () => {
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });
    if (!user) {
      throw new Error("User not found");
    }

    const inventory = await getUserInventory(userId);

    // 有効なアイテムごとに今日の購入数を取得
    const enabledItems = SHOP_ITEMS.filter((item) => item.enabled);
    const purchaseCountsMap = new Map<string, number>();
    for (const item of enabledItems) {
      const count = await getPurchaseCountToday(userId, item.id);
      purchaseCountsMap.set(item.id, count);
    }

    return {
      money: user.money,
      inventory,
      purchaseCountsMap,
    };
  };

  const createShopUI = (
    state: {
      money: number;
      inventory: Awaited<ReturnType<typeof getUserInventory>>;
      purchaseCountsMap: Map<string, number>;
    },
    disabledAll = false,
  ) => {
    const enabledItems = SHOP_ITEMS.filter((item) => item.enabled);

    // 【販売商品】の説明文構築
    let shopDescription =
      `ショップへようこそ！アイテムの購入ができます。\n\n` +
      `**所持金:** ${state.money.toLocaleString()}円\n\n` +
      `**【販売商品】**\n`;

    for (const item of enabledItems) {
      const dailyPurchased = state.purchaseCountsMap.get(item.id) ?? 0;
      const remainingLimit = Math.max(0, item.maxPerDay - dailyPurchased);
      shopDescription +=
        `• **${item.name}** - ${item.price.toLocaleString()}円 (1日${item.maxPerDay}枚まで)\n` +
        `  *${item.description}*\n` +
        `  (本日残り: ${remainingLimit}回)\n\n`;
    }

    // 【所持アイテム】の説明文構築
    shopDescription += `**【所持アイテム】**\n`;
    // 各アイテムの所持数をカウント
    const inventoryCounts = new Map<string, number>();
    for (const item of state.inventory) {
      inventoryCounts.set(
        item.itemId,
        (inventoryCounts.get(item.itemId) ?? 0) + 1,
      );
    }

    if (state.inventory.length === 0) {
      shopDescription += `• 所持しているアイテムはありません\n`;
    } else {
      for (const item of enabledItems) {
        const count = inventoryCounts.get(item.id) ?? 0;
        shopDescription += `• ${item.name} x ${count}\n`;
      }
      // もしenabledではないアイテムもインベントリにある場合
      for (const [itemId, count] of inventoryCounts.entries()) {
        if (!enabledItems.some((item) => item.id === itemId)) {
          const itemDef = SHOP_ITEMS.find((i) => i.id === itemId);
          shopDescription += `• ${itemDef?.name ?? itemId} x ${count}\n`;
        }
      }
    }

    const embed = new EmbedBuilder()
      .setTitle("ショップ")
      .setDescription(shopDescription)
      .setColor(disabledAll ? 0x808080 : 0x00ae86)
      .setTimestamp();

    // Select Menuの作成
    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId("buy_item_select")
      .setPlaceholder("購入するアイテムを選択してください");

    const options = enabledItems.map((item) => {
      const dailyPurchased = state.purchaseCountsMap.get(item.id) ?? 0;
      const remainingLimit = Math.max(0, item.maxPerDay - dailyPurchased);

      const isInsufficient = state.money < item.price;
      const isLimitExceeded = remainingLimit <= 0;

      let prefix = "";
      if (isInsufficient && isLimitExceeded) {
        prefix = "[売切/残高不足] ";
      } else if (isInsufficient) {
        prefix = "[残高不足] ";
      } else if (isLimitExceeded) {
        prefix = "[売切] ";
      }

      const label = `${prefix}${item.name}`;
      const description = `${item.price.toLocaleString()}円 | 本日残り${remainingLimit}回`;

      return {
        label: label.substring(0, 100),
        description: description.substring(0, 100),
        value: item.id,
      };
    });

    if (options.length > 0) {
      selectMenu.addOptions(options);
    } else {
      // オプションがない場合
      selectMenu.addOptions({
        label: "販売中のアイテムはありません",
        value: "none",
      });
      selectMenu.setDisabled(true);
    }

    // すべてのアイテムが無効（すべて売切または残高不足）か、disabledAllがtrueの場合にセレクトメニューを無効化
    const allDisabled = enabledItems.every((item) => {
      const dailyPurchased = state.purchaseCountsMap.get(item.id) ?? 0;
      const remainingLimit = Math.max(0, item.maxPerDay - dailyPurchased);
      return state.money < item.price || remainingLimit <= 0;
    });

    if (disabledAll || allDisabled) {
      selectMenu.setDisabled(true);
    }

    const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
      selectMenu,
    );

    return { embeds: [embed], components: [row] };
  };

  try {
    let state = await getShopState();
    const shopUI = createShopUI(state);

    const message = await interaction.reply({
      ...shopUI,
      ephemeral: true,
      fetchReply: true,
    });

    const collector = message.createMessageComponentCollector({
      componentType: ComponentType.StringSelect,
      time: 5 * 60 * 1000, // 5分
    });

    collector.on("collect", async (i) => {
      if (i.user.id !== userId) {
        await i.reply({
          content: "このショップはあなたのものではありません。",
          ephemeral: true,
        });
        return;
      }

      await i.deferUpdate();

      try {
        if (i.customId === "buy_item_select") {
          const itemId = i.values[0];
          if (itemId === "none") return;

          // 購入処理を実行
          const purchasedItem = await purchaseItem(userId, itemId);

          // 状態を更新
          state = await getShopState();
          const updatedUI = createShopUI(state);

          // 更新完了を通知（editReplyで画面更新、followUpで成功トーストのようなもの）
          await interaction.editReply({
            ...updatedUI,
          });

          await interaction.followUp({
            content: `「${purchasedItem.name}」を購入しました！`,
            ephemeral: true,
          });
        }
      } catch (error) {
        logger.error(`[buy-command] Action error: ${error}`);
        let errorMsg = "アクションの実行中にエラーが発生しました。";
        if (error instanceof ShopError) {
          if (error.code === "INSUFFICIENT_FUNDS") {
            errorMsg = "お金が足りません。";
          } else if (error.code === "DAILY_LIMIT_EXCEEDED") {
            errorMsg = "本日の購入上限に達しています。";
          }
        }
        await interaction.followUp({
          content: `エラー: ${errorMsg}`,
          ephemeral: true,
        });
      }
    });

    collector.on("end", async () => {
      try {
        let expiredDescription =
          `一定時間操作がなかったため、ショップを閉じました。\n再度コマンドを実行してください。\n\n` +
          `**所持金:** ${state.money.toLocaleString()}円\n\n` +
          `**【所持アイテム】**\n`;

        const enabledItems = SHOP_ITEMS.filter((item) => item.enabled);
        const inventoryCounts = new Map<string, number>();
        for (const item of state.inventory) {
          inventoryCounts.set(
            item.itemId,
            (inventoryCounts.get(item.itemId) ?? 0) + 1,
          );
        }

        if (state.inventory.length === 0) {
          expiredDescription += `• 所持しているアイテムはありません\n`;
        } else {
          for (const item of enabledItems) {
            const count = inventoryCounts.get(item.id) ?? 0;
            expiredDescription += `• ${item.name} x ${count}\n`;
          }
          for (const [itemId, count] of inventoryCounts.entries()) {
            if (!enabledItems.some((item) => item.id === itemId)) {
              const itemDef = SHOP_ITEMS.find((i) => i.id === itemId);
              expiredDescription += `• ${itemDef?.name ?? itemId} x ${count}\n`;
            }
          }
        }

        const embed = new EmbedBuilder()
          .setTitle("ショップ (セッション終了)")
          .setDescription(expiredDescription)
          .setColor(0x808080)
          .setTimestamp();

        // 無効化されたセレクトメニューを表示
        const selectMenu = new StringSelectMenuBuilder()
          .setCustomId("buy_item_select")
          .setPlaceholder("セッションが終了しました")
          .setDisabled(true)
          .addOptions({
            label: "セッション終了",
            value: "none",
          });

        const disabledRow =
          new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
            selectMenu,
          );

        await interaction.editReply({
          embeds: [embed],
          components: [disabledRow],
        });
      } catch (err) {
        logger.error(`[buy-command] Collector end update error: ${err}`);
      }
    });
  } catch (error) {
    logger.error(`[buy-command] Initialization error: ${error}`);
    await interaction.reply({
      content: "ショップの読み込み中にエラーが発生しました。",
      ephemeral: true,
    });
  }
}
