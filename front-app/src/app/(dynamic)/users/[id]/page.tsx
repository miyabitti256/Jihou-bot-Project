import { formatDistance } from "date-fns";
import { ja } from "date-fns/locale";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { FaDiscord, FaUser } from "react-icons/fa";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getGuild } from "@/lib/api/guilds";
import { getUser } from "@/lib/api/users";
import { auth } from "@/lib/auth";

export default async function UserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  const { id } = await params;

  if (!session?.user?.id) {
    return null; // proxy.ts will catch this
  }

  if (session.user.id === id) {
    redirect("/dashboard");
  }

  const userData = await getUser(id, [
    "scheduledmessage",
    "omikuji",
    "coinflip",
    "janken",
  ]);

  if (!userData) {
    return notFound();
  }

  if (!userData.data) {
    return notFound();
  }

  const scheduledMessages = userData.data.scheduledMessages_createdUserId ?? [];
  const omikuji = userData.data.omikujis ?? [];
  const coinflip = userData.data.coinFlips ?? [];

  const allJankenGames = [
    ...(userData.data.jankens_challengerId || []),
    ...(userData.data.jankens_opponentId || []),
  ].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  const recentJankenGames = allJankenGames.slice(0, 10);
  const recentCoinFlips = coinflip.slice(0, 30);

  const winRate =
    coinflip.length > 0
      ? (
          (coinflip.filter((log) => log.win).length / coinflip.length) *
          100
        ).toFixed(1)
      : "0.0";

  const jankenWinRate = (() => {
    const gamesExcludingDraws = allJankenGames.filter(
      (game) => game.winnerUserId !== null,
    );
    if (gamesExcludingDraws.length === 0) return "0.0";

    const wins = gamesExcludingDraws.filter(
      (game) => game.winnerUserId === id,
    ).length;
    return ((wins / gamesExcludingDraws.length) * 100).toFixed(1);
  })();

  const hands: Record<string, string> = {
    ROCK: "グー ✊️",
    SCISSORS: "チョキ ✌️",
    PAPER: "パー 🖐️",
  };

  const getHandEmoji = (choice: string) => {
    return hands[choice] || choice;
  };

  const calculateBalance = (games: typeof allJankenGames) => {
    return games.reduce((acc, game) => {
      const isChallenger = game.challengerId === id;
      const myBet = isChallenger
        ? (game.challengerBet ?? 0)
        : (game.opponentBet ?? 0);
      if (game.winnerUserId === id) {
        return acc + myBet;
      }
      if (game.winnerUserId && game.winnerUserId !== id) {
        return acc - myBet;
      }
      return acc;
    }, 0);
  };

  const BalanceDisplay = ({ amount }: { amount: number }) => (
    <span className={amount >= 0 ? "text-green-600" : "text-red-600"}>
      {amount >= 0 ? "+" : ""}
      {amount.toLocaleString()}円
    </span>
  );

  return (
    <div className="p-4 md:p-8 space-y-4 md:space-y-6">
      <div className="flex items-center space-x-4">
        <Avatar className="h-16 w-16 md:h-24 md:w-24">
          <AvatarImage src={userData.data.avatarUrl || ""} />
          <AvatarFallback>
            <FaUser className="h-8 w-8" />
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="flex items-center gap-4">
            <h1 className="text-xl md:text-3xl font-bold">
              {userData.data.username}のプロフィール
            </h1>
          </div>
          <div className="mt-2">
            <Link
              href="/users"
              className="text-sm text-blue-500 hover:text-blue-700"
            >
              ← ユーザー一覧に戻る
            </Link>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2">
        <Card className="col-span-1 md:col-span-2">
          <CardHeader className="p-4 md:p-6">
            <CardTitle className="text-xl md:text-2xl">
              設定した時報一覧
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 md:p-6">
            <div className="max-h-[300px] md:max-h-[400px] overflow-auto">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px] md:w-auto">
                        サーバー
                      </TableHead>
                      <TableHead className="min-w-[120px]">
                        チャンネル
                      </TableHead>
                      <TableHead className="min-w-[120px]">
                        メッセージ
                      </TableHead>
                      <TableHead className="min-w-[100px]">実行時間</TableHead>
                      <TableHead className="min-w-[120px]">
                        ステータス
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {scheduledMessages.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center">
                          時報は設定されていません
                        </TableCell>
                      </TableRow>
                    ) : (
                      scheduledMessages.map(async (message) => {
                        const guildData = await getGuild(message.guildId, [
                          "channels",
                        ]);
                        if (!guildData) {
                          return (
                            <TableRow key={message.id}>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Avatar>
                                    <AvatarFallback>
                                      <FaDiscord />
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="text-muted-foreground">
                                    不明なサーバー
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell className="text-muted-foreground">
                                取得失敗
                              </TableCell>
                              <TableCell>
                                <div className="max-w-[200px] truncate">
                                  {message.message}
                                </div>
                              </TableCell>
                              <TableCell>{message.scheduleTime}</TableCell>
                              <TableCell>
                                <span
                                  className={
                                    message.isActive
                                      ? "text-green-600"
                                      : "text-red-600"
                                  }
                                >
                                  {message.isActive ? "🟢" : "🔴"}
                                  {message.isActive ? "有効" : "無効"}
                                </span>
                              </TableCell>
                            </TableRow>
                          );
                        }
                        return (
                          <TableRow key={message.id}>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Avatar>
                                  <AvatarImage
                                    src={guildData.data.iconUrl ?? ""}
                                  />
                                  <AvatarFallback>
                                    <FaDiscord />
                                  </AvatarFallback>
                                </Avatar>
                                {guildData.data.name}
                              </div>
                            </TableCell>
                            <TableCell>
                              #
                              {
                                guildData.data.guildChannels.find(
                                  (channel) => channel.id === message.channelId,
                                )?.name
                              }
                            </TableCell>
                            <TableCell>
                              <div className="max-w-[200px] truncate">
                                {message.message}
                              </div>
                            </TableCell>
                            <TableCell>{message.scheduleTime}</TableCell>
                            <TableCell>
                              <span
                                className={
                                  message.isActive
                                    ? "text-green-600"
                                    : "text-red-600"
                                }
                              >
                                {message.isActive ? "🟢" : "🔴"}
                                {message.isActive ? "有効" : "無効"}
                              </span>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader className="p-4 md:p-6">
            <CardTitle className="text-xl md:text-2xl">
              プレイヤー情報
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 md:p-6 space-y-4">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">現在の所持金</p>
                <p className="text-2xl md:text-3xl font-bold">
                  {userData.data.money.toLocaleString()}円
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t">
                <div className="text-center sm:text-left">
                  <p className="text-sm text-muted-foreground">
                    コイントス勝率
                  </p>
                  <p className="text-lg md:text-xl font-semibold">{winRate}%</p>
                </div>
                <div className="text-center sm:text-left">
                  <p className="text-sm text-muted-foreground">収支</p>
                  <p className="text-lg md:text-xl font-semibold">
                    <BalanceDisplay
                      amount={coinflip.reduce(
                        (acc, log) => acc + (log.win ? log.bet : -log.bet),
                        0,
                      )}
                    />
                  </p>
                </div>
                <div className="text-center sm:text-left">
                  <p className="text-sm text-muted-foreground">総プレイ回数</p>
                  <p className="text-lg md:text-xl font-semibold">
                    {coinflip.length}回
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t">
                <div className="text-center sm:text-left">
                  <p className="text-sm text-muted-foreground">
                    じゃんけん勝率（引分除）
                  </p>
                  <p className="text-lg md:text-xl font-semibold">
                    {jankenWinRate}%
                  </p>
                </div>
                <div className="text-center sm:text-left">
                  <p className="text-sm text-muted-foreground">収支</p>
                  <p className="text-lg md:text-xl font-semibold">
                    <BalanceDisplay amount={calculateBalance(allJankenGames)} />
                  </p>
                </div>
                <div className="text-center sm:text-left">
                  <p className="text-sm text-muted-foreground">引き分け回数</p>
                  <p className="text-lg md:text-xl font-semibold">
                    {
                      allJankenGames.filter(
                        (game) => game.winnerUserId === null,
                      ).length
                    }
                    回
                  </p>
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  これらのデータは直近の記録です
                </p>
              </div>

              <div className="space-y-2 pt-4 border-t">
                <div className="flex justify-between">
                  <p className="text-sm text-muted-foreground">
                    最終おみくじ実行
                  </p>
                  <p className="text-sm font-medium">
                    {formatDistance(
                      new Date(userData.data.lastDraw || new Date()),
                      new Date(),
                      {
                        addSuffix: true,
                        locale: ja,
                      },
                    )}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader className="p-4 md:p-6">
            <CardTitle className="text-xl md:text-2xl">
              最近のおみくじ結果
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 md:p-6">
            <div className="max-h-[300px] md:max-h-[350px] overflow-auto">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="sticky top-0 bg-background">
                        結果
                      </TableHead>
                      <TableHead className="sticky top-0 bg-background">
                        日時
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {omikuji.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={2} className="text-center">
                          まだおみくじを引いたことがありません
                        </TableCell>
                      </TableRow>
                    ) : (
                      omikuji.map((draw) => (
                        <TableRow key={draw.id}>
                          <TableCell className="font-medium">
                            {draw.result}
                          </TableCell>
                          <TableCell>
                            {formatDistance(
                              new Date(draw.createdAt),
                              new Date(),
                              {
                                locale: ja,
                                addSuffix: true,
                              },
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1 md:col-span-2">
          <CardHeader className="p-4 md:p-6">
            <CardTitle className="text-xl md:text-2xl">
              最近のコインフリップ履歴
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 md:p-6">
            <div className="max-h-[300px] md:max-h-[400px] overflow-auto">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[100px]">賭け金</TableHead>
                      <TableHead className="min-w-[100px]">結果</TableHead>
                      <TableHead className="min-w-[100px]">日時</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentCoinFlips.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center">
                          まだコインフリップをプレイしたことがありません
                        </TableCell>
                      </TableRow>
                    ) : (
                      recentCoinFlips.map((flip) => (
                        <TableRow key={flip.id}>
                          <TableCell>{flip.bet.toLocaleString()}円</TableCell>
                          <TableCell>
                            <span
                              className={`font-medium ${
                                flip.win ? "text-green-600" : "text-red-600"
                              }`}
                            >
                              {flip.win ? "勝ち" : "負け"}
                            </span>
                          </TableCell>
                          <TableCell>
                            {formatDistance(
                              new Date(flip.createdAt),
                              new Date(),
                              {
                                locale: ja,
                                addSuffix: true,
                              },
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1 md:col-span-2">
          <CardHeader className="p-4 md:p-6">
            <CardTitle className="text-xl md:text-2xl">
              最近のじゃんけん対戦履歴
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 md:p-6">
            <div className="max-h-[300px] md:max-h-[400px] overflow-auto">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[100px]">対戦相手</TableHead>
                      <TableHead className="min-w-[100px]">自分の手</TableHead>
                      <TableHead className="min-w-[100px]">相手の手</TableHead>
                      <TableHead className="min-w-[100px]">賭け金</TableHead>
                      <TableHead className="min-w-[100px]">結果</TableHead>
                      <TableHead className="min-w-[100px]">日時</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentJankenGames.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center">
                          まだじゃんけん対戦をプレイしたことがありません
                        </TableCell>
                      </TableRow>
                    ) : (
                      recentJankenGames.map(async (game) => {
                        const isChallenger = game.challengerId === id;
                        const opponentId = isChallenger
                          ? game.opponentId
                          : game.challengerId;
                        const myHand = isChallenger
                          ? game.challengerHand
                          : game.opponentHand;
                        const opponentHand = isChallenger
                          ? game.opponentHand
                          : game.challengerHand;
                        const myBet = isChallenger
                          ? (game.challengerBet ?? 0)
                          : (game.opponentBet ?? 0);
                        const opponent = await getUser(opponentId);
                        if (!opponent) {
                          return (
                            <TableRow key={game.id}>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Avatar>
                                    <AvatarFallback>
                                      <FaUser className="h-5 w-5" />
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="text-muted-foreground">
                                    不明なユーザー
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell>{getHandEmoji(myHand)}</TableCell>
                              <TableCell>
                                {getHandEmoji(opponentHand)}
                              </TableCell>
                              <TableCell>
                                {myBet === 0
                                  ? "なし"
                                  : `${myBet.toLocaleString()}円`}
                              </TableCell>
                              <TableCell>
                                <span className="text-muted-foreground">
                                  不明
                                </span>
                              </TableCell>
                              <TableCell>
                                {formatDistance(
                                  new Date(game.createdAt),
                                  new Date(),
                                  {
                                    locale: ja,
                                    addSuffix: true,
                                  },
                                )}
                              </TableCell>
                            </TableRow>
                          );
                        }
                        const won = game.winnerUserId === id;
                        const draw = game.winnerUserId === null;

                        return (
                          <TableRow key={game.id}>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Avatar>
                                  <AvatarImage
                                    src={opponent.data.avatarUrl ?? ""}
                                  />
                                  <AvatarFallback>
                                    <FaUser className="h-5 w-5" />
                                  </AvatarFallback>
                                </Avatar>
                                {opponent.data.username}
                              </div>
                            </TableCell>
                            <TableCell>{getHandEmoji(myHand)}</TableCell>
                            <TableCell>{getHandEmoji(opponentHand)}</TableCell>
                            <TableCell>
                              {myBet === 0
                                ? "なし"
                                : `${myBet.toLocaleString()}円`}
                            </TableCell>
                            <TableCell>
                              <span
                                className={
                                  draw
                                    ? "text-yellow-600"
                                    : won
                                      ? "text-green-600"
                                      : "text-red-600"
                                }
                              >
                                {draw ? "引き分け" : won ? "勝ち" : "負け"}
                              </span>
                            </TableCell>
                            <TableCell>
                              {formatDistance(
                                new Date(game.createdAt),
                                new Date(),
                                {
                                  locale: ja,
                                  addSuffix: true,
                                },
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
