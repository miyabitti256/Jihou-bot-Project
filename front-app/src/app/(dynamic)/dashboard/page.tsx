import { formatDistance } from "date-fns";
import { ja } from "date-fns/locale";
import Link from "next/link";
import { FaDiscord } from "react-icons/fa";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { getGuild } from "@/lib/api/guilds";
import { getUser } from "@/lib/api/users";
import { auth } from "@/lib/auth";
import { OmikujiHistoryList } from "./_components/omikuji-history-list";

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
    <span
      className={
        amount >= 0
          ? "text-green-600 dark:text-[#23A559]"
          : "text-red-600 dark:text-[#DA373C]"
      }
    >
      {amount >= 0 ? "+" : ""}
      {amount.toLocaleString()}円
    </span>
  );

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
          {userData.data.username}のダッシュボード
        </h1>
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        {/* Scheduled Messages */}
        <div className="col-span-1 lg:col-span-2 bg-white dark:bg-[#2B2D31] rounded-2xl shadow-sm border border-gray-200 dark:border-white/5 overflow-hidden flex flex-col">
          <div className="bg-[#F2F3F5] dark:bg-[#1E1F22] px-6 py-4 border-b border-gray-200 dark:border-black/20 shrink-0">
            <h2 className="font-bold text-lg text-gray-900 dark:text-gray-100">
              あなたが設定した時報一覧
            </h2>
          </div>
          <div className="p-0 overflow-y-auto max-h-[400px]">
            {scheduledMessages.length === 0 ? (
              <div className="p-8 text-center text-gray-500 dark:text-[#949BA4]">
                時報は設定されていません
              </div>
            ) : (
              <div className="flex flex-col">
                {scheduledMessages.map(async (message) => {
                  const guildData = await getGuild(message.guildId, [
                    "channels",
                    "roles",
                  ]);
                  const isSuccess = !!guildData;
                  const guildName = guildData?.data?.name || "不明なサーバー";
                  const channelName =
                    guildData?.data?.guildChannels.find(
                      (c) => c.id === message.channelId,
                    )?.name || "不明";

                  return (
                    <Link
                      href={`/channels/${message.guildId}/${message.channelId}`}
                      key={message.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border-b border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-[#313338] transition-colors gap-4 cursor-pointer"
                    >
                      <div className="flex items-center gap-4 min-w-0 flex-1">
                        <Avatar className="h-10 w-10 shrink-0">
                          {isSuccess && guildData.data.iconUrl ? (
                            <AvatarImage src={guildData.data.iconUrl} />
                          ) : null}
                          <AvatarFallback className="bg-[#5865F2] text-white">
                            <FaDiscord />
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 truncate">
                            <span className="font-semibold text-gray-900 dark:text-white truncate">
                              {guildName}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-[#949BA4] shrink-0">
                              #{channelName}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600 dark:text-[#DBDEE1] truncate mt-0.5">
                            {message.message}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center sm:flex-col sm:items-end justify-between sm:justify-center gap-2 sm:gap-1 shrink-0 ml-14 sm:ml-0">
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-300">
                          {message.scheduleTime}
                        </div>
                        <div
                          className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${message.isActive ? "bg-green-100 text-green-700 dark:bg-[#23A559]/20 dark:text-[#23A559]" : "bg-red-100 text-red-700 dark:bg-[#DA373C]/20 dark:text-[#DA373C]"}`}
                        >
                          {message.isActive ? "有効" : "無効"}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Player Info */}
        <div className="col-span-1 bg-white dark:bg-[#2B2D31] rounded-2xl shadow-sm border border-gray-200 dark:border-white/5 overflow-hidden flex flex-col">
          <div className="bg-[#F2F3F5] dark:bg-[#1E1F22] px-6 py-4 border-b border-gray-200 dark:border-black/20 shrink-0">
            <h2 className="font-bold text-lg text-gray-900 dark:text-gray-100">
              プレイヤー情報
            </h2>
          </div>
          <div className="p-6 flex flex-col gap-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-[#949BA4] uppercase mb-1">
                  現在の所持金
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {userData.data.money.toLocaleString()}円
                </p>
              </div>
              <Avatar className="h-16 w-16 border-4 border-white dark:border-[#1E1F22] rounded-xl shadow-sm shrink-0">
                <AvatarImage src={session.user.image ?? ""} />
                <AvatarFallback className="rounded-xl">
                  <Skeleton className="h-full w-full" />
                </AvatarFallback>
              </Avatar>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3 p-4 bg-gray-50 dark:bg-[#1E1F22] rounded-xl border border-gray-100 dark:border-white/5">
                <div>
                  <p className="text-[10px] sm:text-xs text-gray-500 dark:text-[#949BA4] mb-1">
                    コインフリップ勝率
                  </p>
                  <p className="text-sm sm:text-base font-bold text-gray-900 dark:text-gray-100">
                    {winRate}%
                  </p>
                </div>
                <div>
                  <p className="text-[10px] sm:text-xs text-gray-500 dark:text-[#949BA4] mb-1">
                    収支額
                  </p>
                  <p className="text-sm sm:text-base font-bold">
                    <BalanceDisplay
                      amount={coinflip.reduce(
                        (acc, log) => acc + (log.win ? log.bet : -log.bet),
                        0,
                      )}
                    />
                  </p>
                </div>
                <div>
                  <p className="text-[10px] sm:text-xs text-gray-500 dark:text-[#949BA4] mb-1">
                    総ベット額
                  </p>
                  <p className="text-sm sm:text-base font-bold text-gray-900 dark:text-gray-100">
                    {coinflip
                      .reduce((acc, log) => acc + log.bet, 0)
                      .toLocaleString()}
                    円
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 p-4 bg-gray-50 dark:bg-[#1E1F22] rounded-xl border border-gray-100 dark:border-white/5">
                <div>
                  <p className="text-[10px] sm:text-xs text-gray-500 dark:text-[#949BA4] mb-1">
                    じゃんけん勝率
                  </p>
                  <p className="text-sm sm:text-base font-bold text-gray-900 dark:text-gray-100">
                    {jankenWinRate}%
                  </p>
                </div>
                <div>
                  <p className="text-[10px] sm:text-xs text-gray-500 dark:text-[#949BA4] mb-1">
                    収支額
                  </p>
                  <p className="text-sm sm:text-base font-bold">
                    <BalanceDisplay amount={calculateBalance(allJankenGames)} />
                  </p>
                </div>
                <div>
                  <p className="text-[10px] sm:text-xs text-gray-500 dark:text-[#949BA4] mb-1">
                    引き分け
                  </p>
                  <p className="text-sm sm:text-base font-bold text-gray-900 dark:text-gray-100">
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

            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-[#949BA4] pt-2 border-t border-gray-100 dark:border-white/5">
              <span>※勝率データは直近100件に基づきます</span>
              <div className="flex flex-col items-end">
                <span>最終おみくじ</span>
                <span className="font-semibold text-gray-700 dark:text-gray-300">
                  {formatDistance(
                    new Date(userData.data.lastDraw || new Date()),
                    new Date(),
                    { addSuffix: true, locale: ja },
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Omikuji History */}
        <div className="col-span-1 bg-white dark:bg-[#2B2D31] rounded-2xl shadow-sm border border-gray-200 dark:border-white/5 overflow-hidden flex flex-col">
          <div className="bg-[#F2F3F5] dark:bg-[#1E1F22] px-6 py-4 border-b border-gray-200 dark:border-black/20 shrink-0">
            <h2 className="font-bold text-lg text-gray-900 dark:text-gray-100">
              最近のおみくじ結果
            </h2>
          </div>
          <div className="p-0 overflow-y-auto max-h-[350px]">
            <OmikujiHistoryList
              omikuji={omikuji.map((item) => ({
                id: item.id,
                result: item.result,
                createdAt: item.createdAt,
                withText: item.withText,
                aiText: item.aiText,
              }))}
            />
          </div>
        </div>

        {/* Coin Flip History */}
        <div className="col-span-1 lg:col-span-2 bg-white dark:bg-[#2B2D31] rounded-2xl shadow-sm border border-gray-200 dark:border-white/5 overflow-hidden flex flex-col">
          <div className="bg-[#F2F3F5] dark:bg-[#1E1F22] px-6 py-4 border-b border-gray-200 dark:border-black/20 shrink-0">
            <h2 className="font-bold text-lg text-gray-900 dark:text-gray-100">
              最近のコインフリップ履歴
            </h2>
          </div>
          <div className="p-0 overflow-y-auto max-h-[400px]">
            {recentCoinFlips?.length === 0 ? (
              <div className="p-8 text-center text-gray-500 dark:text-[#949BA4]">
                まだコインフリップをプレイしたことがありません
              </div>
            ) : (
              <div className="flex flex-col">
                {recentCoinFlips.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-[#313338] transition-colors gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shadow-inner ${log.win ? "bg-green-100 text-green-600 dark:bg-[#23A559]/20 dark:text-[#23A559]" : "bg-red-100 text-red-600 dark:bg-[#DA373C]/20 dark:text-[#DA373C]"}`}
                      >
                        {log.win ? "W" : "L"}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-900 dark:text-white">
                          {log.bet.toLocaleString()}円
                        </span>
                        <span className="text-xs text-gray-500 dark:text-[#949BA4]">
                          残高: {log.updatedMoney.toLocaleString()}円
                        </span>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-[#949BA4] shrink-0">
                      {formatDistance(new Date(log.createdAt), new Date(), {
                        addSuffix: true,
                        locale: ja,
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Janken History */}
        <div className="col-span-1 lg:col-span-2 bg-white dark:bg-[#2B2D31] rounded-2xl shadow-sm border border-gray-200 dark:border-white/5 overflow-hidden flex flex-col">
          <div className="bg-[#F2F3F5] dark:bg-[#1E1F22] px-6 py-4 border-b border-gray-200 dark:border-black/20 shrink-0">
            <h2 className="font-bold text-lg text-gray-900 dark:text-gray-100">
              最近のじゃんけん対戦履歴
            </h2>
          </div>
          <div className="p-0 overflow-y-auto max-h-[400px]">
            {recentJankenGames.length === 0 ? (
              <div className="p-8 text-center text-gray-500 dark:text-[#949BA4]">
                まだじゃんけん対戦をプレイしたことがありません
              </div>
            ) : (
              <div className="flex flex-col">
                {recentJankenGames.map(async (game) => {
                  const isChallenger = game.challengerId === session.user.id;
                  const myChoice = isChallenger
                    ? game.challengerHand
                    : game.opponentHand;
                  const opponentChoice = isChallenger
                    ? game.opponentHand
                    : game.challengerHand;
                  const myBet = isChallenger
                    ? game.challengerBet
                    : game.opponentBet;
                  const opponentId = isChallenger
                    ? game.opponentId
                    : game.challengerId;
                  const opponentData = await getUser(opponentId);

                  if (!opponentData) {
                    return (
                      <div
                        key={game.id}
                        className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-white/5"
                      >
                        <span className="text-gray-500">
                          不明なユーザーとの対戦
                        </span>
                      </div>
                    );
                  }

                  const isWinner = game.winnerUserId === session.user.id;
                  const isDraw = game.winnerUserId === null;

                  return (
                    <div
                      key={game.id}
                      className="flex flex-wrap sm:flex-nowrap items-center justify-between p-4 border-b border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-[#313338] transition-colors gap-x-4 gap-y-2"
                    >
                      <div className="flex items-center gap-3 w-full sm:w-[220px] shrink-0">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={opponentData.data.avatarUrl ?? ""}
                          />
                          <AvatarFallback>
                            <Skeleton className="h-full w-full" />
                          </AvatarFallback>
                        </Avatar>
                        <span
                          className="font-semibold text-gray-900 dark:text-white truncate"
                          title={opponentData.data.username}
                        >
                          {opponentData.data.username}
                        </span>
                      </div>

                      <div className="flex-1 flex items-center justify-center sm:justify-start gap-4 text-base sm:text-lg min-w-[120px]">
                        <span title="自分の手">
                          {getHandEmoji(myChoice).split(" ")[1] ??
                            getHandEmoji(myChoice)}
                        </span>
                        <span className="text-[10px] font-black text-gray-400 dark:text-[#5C5E66] italic">
                          VS
                        </span>
                        <span title="相手の手">
                          {getHandEmoji(opponentChoice).split(" ")[1] ??
                            getHandEmoji(opponentChoice)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto shrink-0 mt-2 sm:mt-0">
                        <div className="text-left sm:text-right w-24">
                          <div className="font-bold text-gray-900 dark:text-white text-sm">
                            {myBet === null || myBet === 0
                              ? "無料"
                              : `${myBet?.toLocaleString()}円`}
                          </div>
                          <div
                            className={`text-[10px] font-black tracking-wider ${isDraw ? "text-yellow-600 dark:text-[#FEE75C]" : isWinner ? "text-green-600 dark:text-[#23A559]" : "text-red-600 dark:text-[#DA373C]"}`}
                          >
                            {isDraw ? "DRAW" : isWinner ? "WIN" : "LOSE"}
                          </div>
                        </div>
                        <div className="text-[10px] sm:text-xs text-gray-500 dark:text-[#949BA4] w-20 text-right">
                          {formatDistance(
                            new Date(game.createdAt),
                            new Date(),
                            {
                              addSuffix: true,
                              locale: ja,
                            },
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
