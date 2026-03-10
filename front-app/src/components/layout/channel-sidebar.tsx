import { Hash } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { getGuildChannels, getGuildDiscord } from "@/lib/api/guilds";
import { cn } from "@/lib/utils";

interface ChannelSidebarProps {
  guildId: string;
}

async function ChannelSidebarContent({ guildId }: ChannelSidebarProps) {
  let serverName = `サーバー ${guildId}`;
  let channels: { id: string; name: string }[] = [];

  try {
    const [guildData, channelsData] = await Promise.all([
      getGuildDiscord(guildId),
      getGuildChannels(guildId),
    ]);

    if (guildData) {
      serverName = guildData.data.name;
    }

    if (channelsData) {
      channels = channelsData.data
        .filter((c) => c.type === 0 || c.type === 5)
        .map((c) => ({ id: c.id, name: c.name ?? "" }));
    }
  } catch (error) {
    // biome-ignore lint/suspicious/noConsole: エラー出力
    console.error("[ChannelSidebar] API error:", error);
  }

  return (
    <div className="flex w-full h-full flex-col bg-gray-50 dark:bg-[#2b2d31]">
      <div className="flex h-12 items-center px-4 border-b border-gray-200 dark:border-gray-800 shadow-sm shadow-gray-200/50 dark:shadow-none transition-colors hover:bg-gray-200/50 dark:hover:bg-white/5 cursor-pointer">
        <h2 className="font-bold text-sm text-gray-800 dark:text-gray-100 truncate w-full text-ellipsis">
          {serverName}
        </h2>
      </div>
      <nav className="flex-1 overflow-y-auto w-full p-2">
        <div className="px-2 pt-4 pb-1">
          <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            テキストチャンネル
          </h3>
        </div>
        <div className="space-y-[2px]">
          {channels.length === 0 ? (
            <div className="px-2 py-2 text-sm text-gray-400">
              チャンネルがありません
            </div>
          ) : (
            channels.map((channel) => (
              <Link
                key={channel.id}
                href={`/channels/${guildId}/${channel.id}`}
                className={cn(
                  "flex items-center gap-2 px-2 py-1.5 rounded-md group transition-colors",
                  "text-gray-500 hover:text-gray-800 hover:bg-gray-200/50 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-white/10",
                )}
              >
                <Hash className="w-5 h-5 opacity-60" />
                <span className="font-medium text-[15px] truncate">
                  {channel.name}
                </span>
              </Link>
            ))
          )}
        </div>
      </nav>
    </div>
  );
}

function ChannelSidebarSkeleton() {
  return (
    <div className="flex w-full h-full flex-col bg-gray-50 dark:bg-[#2b2d31]">
      <div className="flex h-12 items-center px-4 border-b border-gray-200 dark:border-gray-800 shadow-sm shadow-gray-200/50 dark:shadow-none">
        <Skeleton className="w-24 h-4 rounded" />
      </div>
      <nav className="flex-1 overflow-y-auto w-full p-2">
        <div className="px-2 pt-4 pb-1">
          <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            テキストチャンネル
          </h3>
        </div>
        <div className="space-y-[2px]">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: skeleton
              key={i}
              className="flex items-center gap-2 px-2 py-1.5"
            >
              <Hash className="w-5 h-5 opacity-30 text-gray-400 dark:text-gray-500 shrink-0" />
              <div className="flex-1 flex items-center h-[22.5px] py-[3.25px]">
                <Skeleton className="h-4 w-32 rounded" />
              </div>
            </div>
          ))}
        </div>
      </nav>
    </div>
  );
}

export async function ChannelSidebar({ guildId }: ChannelSidebarProps) {
  return (
    <Suspense fallback={<ChannelSidebarSkeleton />}>
      <ChannelSidebarContent guildId={guildId} />
    </Suspense>
  );
}
