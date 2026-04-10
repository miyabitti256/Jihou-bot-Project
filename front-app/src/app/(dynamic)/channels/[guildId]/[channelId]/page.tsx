import { Clock, Hash, Search } from "lucide-react";
import { notFound } from "next/navigation";
import { ChannelNameUpdater } from "@/components/provider/channel-name-updater";
import { getGuild, getGuildChannels } from "@/lib/api/guilds";
import { auth } from "@/lib/auth";
import { JihouInputBar } from "./_components/jihou-input-bar";
import { JihouMessage } from "./_components/jihou-message";

interface ChannelPageProps {
  params: Promise<{
    guildId: string;
    channelId: string;
  }>;
}

export default async function ChannelPage({ params }: ChannelPageProps) {
  const { guildId, channelId } = await params;
  const session = await auth();
  const userId = session?.user?.id ?? "";

  let channelName = channelId === "general" ? "一般" : channelId;

  // チャンネル名を取得
  try {
    const channelsData = await getGuildChannels(guildId);
    if (!channelsData) {
      notFound();
    }
    const channel = channelsData.data.find((c) => c.id === channelId);
    if (channel?.name) {
      channelName = channel.name;
    }
  } catch (error) {
    if ((error as Error).message === "NEXT_NOT_FOUND") throw error;
    // biome-ignore lint/suspicious/noConsole: エラー出力
    console.error("[ChannelPage] Channel API error:", error);
  }

  // 時報データを取得
  let scheduledMessages: {
    id: string;
    message: string;
    channelId: string;
    scheduleTime: string;
    guildId: string;
    isActive: boolean;
    createdUserId?: string;
  }[] = [];

  try {
    const guildData = await getGuild(guildId, ["messages", "channels"]);
    if (!guildData) {
      notFound();
    }
    if (guildData.data.scheduledMessages) {
      scheduledMessages = guildData.data.scheduledMessages
        .filter((msg) => msg.channelId === channelId)
        .sort((a, b) => a.scheduleTime.localeCompare(b.scheduleTime));
    }
  } catch (error) {
    if ((error as Error).message === "NEXT_NOT_FOUND") throw error;
    // biome-ignore lint/suspicious/noConsole: エラー出力
    console.error("[ChannelPage] Guild API error:", error);
  }

  return (
    <div className="flex flex-col h-[calc(100dvh-3rem)] md:h-dvh bg-white dark:bg-[#313338]">
      <ChannelNameUpdater name={channelName} />
      {/* チャンネルヘッダー (PCのみ表示、モバイルはNavigationShellで処理) */}
      <header className="hidden md:flex h-12 items-center px-4 border-b border-gray-200 dark:border-gray-800 shadow-sm shrink-0">
        <Hash className="w-6 h-6 text-gray-500 mr-2 opacity-60" />
        <h2 className="font-bold text-base text-gray-800 dark:text-gray-100 flex-1 truncate">
          {channelName}
        </h2>
        <button
          type="button"
          className="p-2 ml-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
        >
          <Search className="w-5 h-5" />
        </button>
      </header>

      {/* 時報メッセージ一覧 */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {scheduledMessages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center h-full text-gray-400 py-16">
            <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
              <Clock className="w-8 h-8 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-600 dark:text-gray-300">
              #{channelName} へようこそ！
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center max-w-md">
              このチャンネルにはまだ時報が設定されていません。
              <br />
              下の入力欄から時報を追加してみましょう。
            </p>
          </div>
        ) : (
          <div className="py-4">
            {/* チャンネル開始メッセージ */}
            <div className="px-4 pb-4 mb-2 border-b border-gray-200 dark:border-gray-800">
              <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-3">
                <Hash className="w-8 h-8 text-gray-400 dark:text-gray-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-1">
                #{channelName} の時報一覧
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                このチャンネルに設定された時報が {scheduledMessages.length}{" "}
                件あります。
              </p>
            </div>

            {/* メッセージ一覧 */}
            <div className="divide-y divide-transparent">
              {scheduledMessages.map((msg) => (
                <JihouMessage
                  key={msg.id}
                  message={msg}
                  userId={userId}
                  channelId={channelId}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 時報追加入力バー */}
      <JihouInputBar
        guildId={guildId}
        channelId={channelId}
        channelName={channelName}
        userId={userId}
      />
    </div>
  );
}
