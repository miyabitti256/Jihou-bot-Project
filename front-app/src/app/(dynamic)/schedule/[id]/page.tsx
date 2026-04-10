import { notFound } from "next/navigation";
import { getGuild, getScheduleDetails } from "@/lib/api/guilds";
import { auth } from "@/lib/auth";
import { ScheduleForm } from "./_components/schedule-form";

export default async function SchedulePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ guildId: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    return null; // proxy.ts will catch this
  }

  const { id } = await params;
  const query = await searchParams;
  const isNew = id === "new";

  let scheduleData = null;
  let guildId: string | null = null;

  if (!isNew) {
    const scheduleResult = await getScheduleDetails(id);
    if (!scheduleResult) {
      notFound();
    }
    scheduleData = scheduleResult.data;
    guildId = scheduleData.guildId;
  } else {
    guildId = query.guildId;
  }

  let guildData = null;
  let channelData = null;

  if (guildId) {
    const guildResult = await getGuild(guildId, ["channels"]);
    if (!guildResult) {
      notFound();
    }
    guildData = guildResult.data;
    channelData = guildResult.data.guildChannels.filter(
      (channel) => channel.type === "0",
    );
  }

  return (
    <div className="container max-w-2xl mx-auto py-8">
      <ScheduleForm
        initialData={scheduleData}
        isNew={isNew}
        guildData={{
          id: guildId ?? "",
          name: guildData?.name ?? "",
          icon: guildData?.iconUrl ?? "",
        }}
        channels={channelData ?? []}
        userId={session.user.id}
      />
    </div>
  );
}
