"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { purchaseItemAction } from "@/lib/actions/shop";
import { getTokyoDate } from "@/lib/utils";

interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  effect: string;
  maxPerDay: number;
  enabled: boolean;
}

interface UserItem {
  id: string;
  userId: string;
  itemId: string;
  purchaseId: string;
  usedAt: string | null;
  createdAt: string;
  updatedAt?: string | null;
}

interface PurchaseHistory {
  id: string;
  userId: string;
  itemId: string;
  price: number;
  createdAt: string;
}

interface ShopWidgetProps {
  userId: string;
  userMoney: number;
  initialInventory: UserItem[];
  initialHistory: PurchaseHistory[];
  shopItems: ShopItem[];
}

export function ShopWidget({
  userMoney,
  initialInventory,
  initialHistory,
  shopItems,
}: ShopWidgetProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // "omikuji_ticket" のアイテム情報を取得
  const omikujiTicketItem = shopItems.find((i) => i.id === "omikuji_ticket");
  const ticketPrice = omikujiTicketItem?.price ?? 1500;

  // 今日の購入回数を算出
  const todayDateStr = getTokyoDate().toDateString();
  const todayPurchases = initialHistory.filter(
    (h) =>
      h.itemId === "omikuji_ticket" &&
      getTokyoDate(h.createdAt).toDateString() === todayDateStr,
  );
  const todayCount = todayPurchases.length;
  const isLimitReached = todayCount >= (omikujiTicketItem?.maxPerDay ?? 1);
  const hasEnoughMoney = userMoney >= ticketPrice;

  // 購入処理
  const handlePurchase = () => {
    if (!hasEnoughMoney) {
      toast.error("所持金が不足しています");
      return;
    }
    if (isLimitReached) {
      toast.error("本日の購入制限に達しました");
      return;
    }

    startTransition(async () => {
      const res = await purchaseItemAction("omikuji_ticket");
      if (res.success) {
        toast.success("おみくじ券を購入しました！");
        router.refresh();
      } else {
        toast.error(res.error || "購入に失敗しました");
      }
    });
  };

  // インベントリから未使用のおみくじ券を抽出
  const ticketsInInventory = initialInventory.filter(
    (item) => item.itemId === "omikuji_ticket",
  );

  return (
    <Card className="bg-white dark:bg-[#2B2D31] rounded-2xl shadow-sm border border-gray-200 dark:border-white/5 overflow-hidden flex flex-col h-full">
      <CardHeader className="bg-[#F2F3F5] dark:bg-[#1E1F22] px-6 py-4 border-b border-gray-200 dark:border-black/20">
        <CardTitle className="font-bold text-lg text-gray-900 dark:text-gray-100">
          ショップ
        </CardTitle>
        <CardDescription className="text-xs text-gray-500 dark:text-[#949BA4]">
          貯めたお金でアイテムを購入・使用できます
        </CardDescription>
      </CardHeader>

      <CardContent className="p-6 space-y-6 flex-1">
        {/* 購入カード */}
        <div className="space-y-3">
          <h3 className="font-bold text-sm text-gray-700 dark:text-gray-300">
            商品リスト
          </h3>
          <div className="p-4 bg-gray-50 dark:bg-[#1E1F22] rounded-xl border border-gray-100 dark:border-white/5 flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-900 dark:text-white text-sm">
                  おみくじ券 🎫
                </span>
                <span className="text-xs bg-yellow-100 dark:bg-[#FEE75C]/20 text-yellow-800 dark:text-[#FEE75C] font-bold px-2 py-0.5 rounded">
                  {ticketPrice.toLocaleString()}円
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-[#949BA4] mt-1 line-clamp-2">
                {omikujiTicketItem?.description ??
                  "一日に一度しか引けないおみくじをもう一度引くことができるチケット"}
              </p>
              <p className="text-[10px] text-gray-400 dark:text-[#5C5E66] mt-1">
                今日の購入: {todayCount} / {omikujiTicketItem?.maxPerDay ?? 1}
              </p>
            </div>

            <Button
              size="sm"
              disabled={isPending || isLimitReached || !hasEnoughMoney}
              onClick={handlePurchase}
              className="shrink-0 bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold"
            >
              {isLimitReached ? "購入済み" : "購入する"}
            </Button>
          </div>
        </div>

        {/* 所持アイテム */}
        <div className="space-y-3">
          <h3 className="font-bold text-sm text-gray-700 dark:text-gray-300">
            所持アイテム
          </h3>
          <div className="p-4 bg-gray-50 dark:bg-[#1E1F22] rounded-xl border border-gray-100 dark:border-white/5 flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-900 dark:text-white text-sm">
                  おみくじ券 🎫
                </span>
                <span className="text-xs bg-gray-100 dark:bg-white/5 text-gray-800 dark:text-gray-300 font-bold px-2 py-0.5 rounded">
                  所持数: {ticketsInInventory.length}個
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-[#949BA4] mt-1">
                おみくじを引き直すことができるチケットです
              </p>
            </div>

            <Button
              size="sm"
              variant="outline"
              disabled={ticketsInInventory.length === 0}
              onClick={() => router.push("/minigame/omikuji")}
              className="shrink-0 h-8 border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-[#383A40] text-xs font-semibold"
            >
              使用する
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
