import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getOmikujiResults } from "@/lib/api/minigame";
import { getUserInventory } from "@/lib/api/shop";
import { getUser } from "@/lib/api/users";
import { auth } from "@/lib/auth";
import { getTokyoDate, hasDrawnToday } from "@/lib/utils";
import DrawOmikuji from "./_components/draw-omikuji";
import { UseOmikujiTicketButton } from "./_components/use-ticket-button";

export default async function OmikujiPage() {
  const session = await auth();
  if (!session) {
    return <div>ログインしてください</div>;
  }

  const [userData, omikujiData, inventoryData] = await Promise.all([
    getUser(session.user.id),
    getOmikujiResults(session.user.id, "1"),
    getUserInventory(session.user.id),
  ]);

  const now = getTokyoDate();
  const lastDraw = userData?.data?.lastDraw
    ? new Date(userData.data.lastDraw)
    : null;
  const isDrawn = lastDraw ? hasDrawnToday(now, lastDraw) : false;
  const latestResult = omikujiData ? omikujiData.data[0] : undefined;

  // 未使用のおみくじ券があるかチェック
  const ticket = inventoryData?.data?.find(
    (item) => item.itemId === "omikuji_ticket" && item.usedAt === null,
  );

  return isDrawn ? (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="w-64 h-64 relative mb-4">
        {latestResult?.result ? (
          <Image
            src={`/images/omikuji-${latestResult.result}.png`}
            alt={`今日の結果: ${latestResult.result}`}
            fill
            className="object-contain"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center border border-dashed rounded-md text-gray-500">
            結果画像を読み込めませんでした
          </div>
        )}
      </div>
      <p>今日の運勢: {latestResult?.result || "不明"}</p>
      {ticket && <UseOmikujiTicketButton ticketId={ticket.id} />}
      <Link href={"/minigame"}>
        <Button variant={"secondary"} className="mt-4">
          戻る
        </Button>
      </Link>
    </div>
  ) : (
    <DrawOmikuji />
  );
}
