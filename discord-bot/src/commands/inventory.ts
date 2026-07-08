import { getUserInventory } from "@bot/services/shop/shop";
import { SHOP_ITEMS } from "@bot/services/shop/shop-items";
import { ensureUserExists } from "@bot/services/users/user";
import {
  type ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("inventory")
  .setDescription("所持しているアイテムの一覧を確認します");

export async function execute(interaction: ChatInputCommandInteraction) {
  const userId = interaction.user.id;
  const username = interaction.user.username;

  // ユーザーの存在を保証
  await ensureUserExists(userId, username);

  // ユーザーの所持アイテム（未使用）を取得
  const inventory = await getUserInventory(userId);

  // アイテムごとに所持数をカウント
  const inventoryCounts = new Map<string, number>();
  for (const item of inventory) {
    inventoryCounts.set(
      item.itemId,
      (inventoryCounts.get(item.itemId) ?? 0) + 1,
    );
  }

  let description = "";

  if (inventory.length === 0) {
    description = "所持しているアイテムはありません。";
  } else {
    const displayedItemIds = new Set<string>();

    // SHOP_ITEMS で定義されているアイテムを順に表示
    for (const shopItem of SHOP_ITEMS) {
      const count = inventoryCounts.get(shopItem.id) ?? 0;
      if (count > 0) {
        description += `• **${shopItem.name}** x ${count}\n  *${shopItem.description}*\n`;
        displayedItemIds.add(shopItem.id);
      }
    }

    // もしSHOP_ITEMSに定義されていないアイテムを所持している場合のフォールバック表示
    for (const [itemId, count] of inventoryCounts.entries()) {
      if (!displayedItemIds.has(itemId)) {
        description += `• **${itemId}** x ${count}\n  *詳細情報がありません*\n`;
      }
    }

    // 末尾の余分な改行を削除
    description = description.trim();
  }

  const embed = new EmbedBuilder()
    .setTitle(`🎒 ${username}さんのインベントリ`)
    .setDescription(description)
    .setColor(0x00ae86)
    .setTimestamp();

  await interaction.reply({
    embeds: [embed],
    ephemeral: true,
  });
}
