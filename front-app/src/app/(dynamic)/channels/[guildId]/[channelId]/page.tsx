import { Hash, Search } from "lucide-react";
import { ChannelNameUpdater } from "@/components/provider/channel-name-updater";
import { getGuildChannels } from "@/lib/api/guilds";

interface ChannelPageProps {
  params: Promise<{
    guildId: string;
    channelId: string;
  }>;
}

export default async function ChannelPage({ params }: ChannelPageProps) {
  const { guildId, channelId } = await params;

  let channelName = channelId === "general" ? "一般" : channelId;

  try {
    const channelsData = await getGuildChannels(guildId);
    if (channelsData) {
      const channel = channelsData.data.find((c) => c.id === channelId);
      if (channel?.name) {
        channelName = channel.name;
      }
    }
  } catch (error) {
    // biome-ignore lint/suspicious/noConsole: エラー出力
    console.error("[ChannelPage] API error:", error);
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-white dark:bg-[#313338]">
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

      {/* メインチャットエリア（モック） */}
      <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
        <h3 className="text-2xl font-bold mb-2 text-gray-700 dark:text-gray-200">
          ここは #{channelName} チャンネルの始まりです。
        </h3>
        <p>
          サーバーID: {guildId} / チャンネルID: {channelId}
        </p>
      </div>
    </div>
  );
}
