import { Hash, Search } from "lucide-react";
import { ChannelNameUpdater } from "@/components/provider/channel-name-updater";

export default function ChannelLoading() {
  return (
    <div className="flex flex-col h-[calc(100dvh-3rem)] md:h-dvh bg-white dark:bg-[#313338]">
      <ChannelNameUpdater name="読み込み中..." />
      {/* チャンネルヘッダー Skeleton */}
      <header className="hidden md:flex h-12 items-center px-4 border-b border-gray-200 dark:border-gray-800 shadow-sm shrink-0">
        <Hash className="w-6 h-6 text-gray-400 dark:text-gray-500 mr-2 opacity-60" />
        <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded animate-pulse w-32 flex-1" />
        <div className="p-2 ml-2 text-gray-400 dark:text-gray-600">
          <Search className="w-5 h-5" />
        </div>
      </header>

      {/* メッセージ一覧 Skeleton */}
      <div className="flex-1 overflow-y-auto min-h-0 pt-4 px-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            // biome-ignore lint/suspicious/noArrayIndexKey: skeleton
            key={i}
            className="flex gap-4 py-4"
          >
            <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800 animate-pulse shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse w-24" />
                <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded animate-pulse w-16" />
              </div>
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse w-full max-w-md" />
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse w-3/4 max-w-sm" />
            </div>
          </div>
        ))}
      </div>

      {/* 時報追加入力バー Skeleton */}
      <div className="p-4 shrink-0">
        <div className="h-12 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse w-full" />
      </div>
    </div>
  );
}
