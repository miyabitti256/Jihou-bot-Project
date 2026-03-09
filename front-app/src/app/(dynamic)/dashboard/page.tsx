import { formatDistance } from "date-fns";
import { ja } from "date-fns/locale";
import { FaDiscord } from "react-icons/fa";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
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

export default async function Dashboard() {
  const session = await auth();

  if (!session?.user?.id) {
    return null; // proxy.ts will catch this
  }

  const userData = await getUser(session.user.id, [
    "scheduledmessage",
    "omikuji",
    "coinflip",
    "janken",
  ]);
  if (!userData) {
    return <div>User data not found</div>;
  }

  const scheduledMessages = userData.data.scheduledMessages_createdUserId ?? [];
  const omikuji = userData.data.omikujis ?? [];
  const coinflip = userData.data.coinFlips ?? [];

  const allJankenGames = [
    ...(userData?.data?.jankens_challengerId ?? []),
    ...(userData?.data?.jankens_opponentId ?? []),
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
      (game) => game.winnerUserId === session.user.id,
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
      const isChallenger = game.challengerId === session.user.id;
      const myBet = isChallenger
        ? (game.challengerBet ?? 0)
        : (game.opponentBet ?? 0);
      if (game.winnerUserId === session.user.id) {
        return acc + myBet;
      }
      if (game.winnerUserId && game.winnerUserId !== session.user.id) {
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
      <h1 className="text-xl md:text-3xl font-bold">
        {userData.data.username}のダッシュボード
      </h1>

      <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2">
        <Card className="col-span-1 md:col-span-2">
          <CardHeader className="p-4 md:p-6">
            <CardTitle className="text-xl md:text-2xl">
              あなたが設定した時報一覧
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
                          "roles",
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
                              <TableCell className="max-w-[300px] truncate">
                                {message.message}
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
                            <TableCell className="max-w-[300px] truncate">
                              {message.message}
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
            <div className="flex items-start sm:items-center justify-between gap-4">
              <div>
                <p className="text-sm text-muted-foreground">現在の所持金</p>
                <p className="text-2xl md:text-3xl font-bold">
                  {userData.data.money.toLocaleString()}円
                </p>
              </div>
              <Avatar className="h-12 w-12">
                <AvatarImage src={session.user.image ?? ""} />
                <AvatarFallback>
                  <Skeleton className="h-10 w-10" />
                </AvatarFallback>
              </Avatar>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t">
                <div className="text-center sm:text-left">
                  <p className="text-sm text-muted-foreground">
                    コインフリップ勝率(直近100回)
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
                  <p className="text-sm text-muted-foreground">総ベット額</p>
                  <p className="text-lg md:text-xl font-semibold">
                    {coinflip
                      .reduce((acc, log) => acc + log.bet, 0)
                      .toLocaleString()}
                    円
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
            </div>

            <div className="space-y-2 pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                これらのデータは直近100件のものです
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
                      omikuji.map((result) => (
                        <TableRow key={result.id}>
                          <TableCell className="font-medium">
                            {result.result}
                          </TableCell>
                          <TableCell>
                            {formatDistance(
                              new Date(result.createdAt),
                              new Date(),
                              {
                                addSuffix: true,
                                locale: ja,
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
                      <TableHead className="min-w-[150px]">
                        ゲーム後の所持金
                      </TableHead>
                      <TableHead className="min-w-[100px]">日時</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentCoinFlips?.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center">
                          まだコインフリップをプレイしたことがありません
                        </TableCell>
                      </TableRow>
                    ) : (
                      recentCoinFlips?.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell>{log.bet.toLocaleString()}円</TableCell>
                          <TableCell>
                            <span
                              className={
                                log.win ? "text-green-600" : "text-red-600"
                              }
                            >
                              {log.win ? "勝ち" : "負け"}
                            </span>
                          </TableCell>
                          <TableCell>
                            {log.updatedMoney.toLocaleString()}円
                          </TableCell>
                          <TableCell>
                            {formatDistance(
                              new Date(log.createdAt),
                              new Date(),
                              {
                                addSuffix: true,
                                locale: ja,
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
                        const isChallenger =
                          game.challengerId === session.user.id;
                        const myChoice = isChallenger
                          ? game.challengerHand
                          : game.opponentHand;
                        const opponentChoice = isChallenger
                          ? game.opponentHand
                          : game.challengerHand;
                        const myBet = isChallenger
                          ? game.challengerBet
                          : game.opponentBet;
                        const opponent = isChallenger
                          ? game.opponentId
                          : game.challengerId;
                        const opponentData = await getUser(opponent);
                        if (!opponentData) {
                          return (
                            <TableRow key={game.id}>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Avatar>
                                    <AvatarFallback>
                                      <Skeleton className="h-10 w-10" />
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="text-muted-foreground">
                                    不明なユーザー
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell>{getHandEmoji(myChoice)}</TableCell>
                              <TableCell>
                                {getHandEmoji(opponentChoice)}
                              </TableCell>
                              <TableCell>
                                {myBet === null || myBet === 0
                                  ? "なし"
                                  : `${myBet?.toLocaleString()}円`}
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
                                    addSuffix: true,
                                    locale: ja,
                                  },
                                )}
                              </TableCell>
                            </TableRow>
                          );
                        }
                        const isWinner = game.winnerUserId === session.user.id;

                        return (
                          <TableRow key={game.id}>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Avatar>
                                  <AvatarImage
                                    src={opponentData.data.avatarUrl ?? ""}
                                  />
                                  <AvatarFallback>
                                    <Skeleton className="h-10 w-10" />
                                  </AvatarFallback>
                                </Avatar>
                                {opponentData.data.username}
                              </div>
                            </TableCell>
                            <TableCell>{getHandEmoji(myChoice)}</TableCell>
                            <TableCell>
                              {getHandEmoji(opponentChoice)}
                            </TableCell>
                            <TableCell>
                              {myBet === null || myBet === 0
                                ? "なし"
                                : `${myBet?.toLocaleString()}円`}
                            </TableCell>
                            <TableCell>
                              <span
                                className={
                                  game.winnerUserId
                                    ? isWinner
                                      ? "text-green-600"
                                      : "text-red-600"
                                    : "text-yellow-600"
                                }
                              >
                                {game.winnerUserId
                                  ? isWinner
                                    ? "勝ち"
                                    : "負け"
                                  : "引き分け"}
                              </span>
                            </TableCell>
                            <TableCell>
                              {formatDistance(
                                new Date(game.createdAt),
                                new Date(),
                                {
                                  addSuffix: true,
                                  locale: ja,
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
