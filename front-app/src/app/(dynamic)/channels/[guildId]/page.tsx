import { MessageSquare } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getGuild } from "@/lib/api/guilds";

interface GuildPageProps {
  params: Promise<{
    guildId: string;
  }>;
}

export default async function GuildPage({ params }: GuildPageProps) {
  const { guildId } = await params;

  const guildData = await getGuild(guildId);

  const guildName = guildData?.data.name ?? `サーバー ${guildId}`;
  const guildIconUrl = guildData?.data.iconUrl ?? null;

  return (
    <div className="flex-1 flex flex-col items-center justify-center h-full bg-white dark:bg-[#313338] text-gray-400">
      <Avatar className="w-24 h-24 mb-6 rounded-2xl shadow-lg ring-4 ring-white dark:ring-[#2b2d31]">
        <AvatarImage
          src={guildIconUrl ?? ""}
          alt={guildName}
          className="rounded-2xl object-cover"
        />
        <AvatarFallback className="rounded-2xl bg-gray-100 dark:bg-gray-800">
          <MessageSquare className="w-12 h-12 opacity-50 text-gray-500 dark:text-gray-400" />
        </AvatarFallback>
      </Avatar>
      <h2 className="text-2xl font-bold mb-4 text-gray-700 dark:text-gray-200">
        {guildName}
      </h2>
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800/80 px-6 py-3 rounded-full shadow-sm">
        左のサイドバーからチャンネルを選択してください
      </p>
    </div>
  );
}
