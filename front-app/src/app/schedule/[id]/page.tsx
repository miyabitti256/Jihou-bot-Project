import NoAuthRedirect from "@/components/noAuthRedirect";
import { auth } from "@/lib/auth";
import { createApiClient } from "@/lib/rpc-client";
import { ScheduleForm } from "./components/schedule-form";

export default async function SchedulePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ guildId: string }>;
}) {
  const session = await auth();
  if (!session) {
    return <NoAuthRedirect redirectPath="/" />;
  }

  const { id } = await params;
  const query = await searchParams;
  const isNew = id === "new";

  const client = await createApiClient();

  let scheduleData = null;
  let guildId: string | null = null;

  if (!isNew) {
    const res = await client.api.guilds.scheduledmessage.details[":id"].$get({
      param: { id },
    });
    if (!res.ok) {
      throw new Error("Failed to fetch schedule details");
    }
    const json = await res.json();
    scheduleData = json.data;
    guildId = scheduleData.guildId;
  } else {
    guildId = query.guildId;
  }

  let guildData = null;
  let channelData = null;

  if (guildId) {
    const res = await client.api.guilds[":guildId"].$get({
      param: { guildId },
      query: { includes: ["channels"] },
    });
    if (!res.ok) {
      throw new Error("Failed to fetch guild data");
    }
    const json = await res.json();
    guildData = json.data;
    channelData = json.data.channels.filter((channel) => channel.type === "0");
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
