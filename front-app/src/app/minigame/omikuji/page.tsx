import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { getTokyoDate, hasDrawnToday } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import DrawOmikuji from "./components/draw-omikuji";

export default async function OmikujiPage() {
  const session = await auth();
  if (!session) {
    return <div>ログインしてください</div>;
  }

  const user = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/users/${session.user.id}`,
    {
      method: "GET",
      headers: {
        "X-API-Key": process.env.API_KEY as string,
      },
    },
  );

  const omikuji = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/minigame/omikuji/result/${session.user.id}?take=1`,
    {
      method: "GET",
      headers: {
        "X-API-Key": process.env.API_KEY as string,
      },
    },
  );

  const data = {
    user: await user.json(),
    omikujiResults: await omikuji.json(),
  };

  const now = getTokyoDate();
  const lastDraw = new Date(data.user?.data.lastDraw);
  const isDrawn = hasDrawnToday(now, lastDraw);
  const latestResult = data.omikujiResults?.data[0];

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
    <DrawOmikuji userId={session.user.id} />
  );
}
