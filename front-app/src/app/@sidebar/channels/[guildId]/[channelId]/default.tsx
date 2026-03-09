import { ChannelSidebar } from "@/components/layout/channel-sidebar";
import { headers } from "next/headers";

export default async function ChannelSidebarDefault() {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "";

  // /channels/[guildId]/[channelId] からguildIdを抽出
  const match = pathname.match(/\/channels\/(\d+)/);
  const guildId = match?.[1];

  if (!guildId) {
    return null;
  }

  return <ChannelSidebar guildId={guildId} />;
}
