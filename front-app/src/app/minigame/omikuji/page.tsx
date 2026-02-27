import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { createApiClient } from "@/lib/rpc-client";
import { getTokyoDate, hasDrawnToday } from "@/lib/utils";
import DrawOmikuji from "./components/draw-omikuji";

export default async function OmikujiPage() {
  const session = await auth();
  if (!session) {
    return <div>ログインしてください</div>;
  }

  const client = await createApiClient();

  const userRes = await client.api.users[":userId"].$get({
    param: { userId: session.user.id },
    query: {},
  });

  const omikujiRes = await client.api.minigame.omikuji.result[":userId"].$get({
    param: { userId: session.user.id },
    query: { take: "1" },
  });

  const data = {
    user: await userRes.json(),
    omikujiResults: await omikujiRes.json(),
  };

  const now = getTokyoDate();
  const lastDraw = new Date(
    (data.user as { data: { lastDraw: string } }).data.lastDraw,
  );
  const isDrawn = hasDrawnToday(now, lastDraw);
  const latestResult = (
    data.omikujiResults as { data: Array<{ result: string }> }
  ).data[0];

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
