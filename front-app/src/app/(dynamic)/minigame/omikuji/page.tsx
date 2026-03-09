import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getOmikujiResults } from "@/lib/api/minigame";
import { getUser } from "@/lib/api/users";
import { auth } from "@/lib/auth";
import { getTokyoDate, hasDrawnToday } from "@/lib/utils";
import DrawOmikuji from "./_components/draw-omikuji";

export default async function OmikujiPage() {
  const session = await auth();
  if (!session) {
    return <div>ログインしてください</div>;
  }

  const [userData, omikujiData] = await Promise.all([
    getUser(session.user.id),
    getOmikujiResults(session.user.id, "1"),
  ]);

  const now = getTokyoDate();
  const lastDraw = new Date(
    userData ? userData.data.lastDraw || new Date() : new Date(),
  );
  const isDrawn = hasDrawnToday(now, lastDraw);
  const latestResult = omikujiData ? omikujiData.data[0] : undefined;

  return isDrawn ? (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="w-64 h-64 relative mb-4">
        <Image
          src={`/images/omikuji-${latestResult?.result}.png`}
          alt={`今日の結果: ${latestResult?.result}`}
          fill
          className="object-contain"
        />
      </div>
      <p>今日の運勢: {latestResult?.result}</p>
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
