import { MessageSquare } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function GuildLoading() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center h-full bg-white dark:bg-[#313338]">
      <div className="w-24 h-24 mb-6 rounded-2xl shadow-lg ring-4 ring-white dark:ring-[#2b2d31] bg-gray-100 dark:bg-gray-800 animate-pulse flex items-center justify-center">
        <MessageSquare className="w-12 h-12 opacity-30 text-gray-500 dark:text-gray-400" />
      </div>
      <Skeleton className="h-8 w-48 mb-4" />
      <Skeleton className="h-10 w-80 rounded-full" />
    </div>
  );
}
