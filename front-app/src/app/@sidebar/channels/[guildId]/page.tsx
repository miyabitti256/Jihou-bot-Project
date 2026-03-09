import { ChannelSidebar } from "@/components/layout/channel-sidebar";

interface ChannelSidebarPageProps {
  params: Promise<{
    guildId: string;
  }>;
}

export default async function ChannelSidebarPage({
  params,
}: ChannelSidebarPageProps) {
  const { guildId } = await params;
  return <ChannelSidebar guildId={guildId} />;
}
