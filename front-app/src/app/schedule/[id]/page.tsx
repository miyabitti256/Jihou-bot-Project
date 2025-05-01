import NoAuthRedirect from "@/components/noAuthRedirect";
import { auth } from "@/lib/auth";
import type {
  GuildChannel,
  GuildData,
  ScheduledMessage,
} from "@/types/api-response";
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
  let scheduleData: ScheduledMessage | null = null;
  let guildId = null;
  let guildData: GuildData["data"] | null = null;
  let channelData: GuildChannel[] | null = null;

  if (!isNew) {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/guilds/scheduledmessage/details/${id}`,
      {
        headers: {
          "X-API-Key": process.env.API_KEY as string,
        },
      },
    );
    scheduleData = await response.json().then((data) => data.data);
    guildId = scheduleData?.guildId;
  } else {
    guildId = query.guildId;
  }

  if (guildId) {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/guilds/${guildId}?includes=channels`,
      {
        headers: {
          "X-API-Key": process.env.API_KEY as string,
        },
      },
    ).then((response) => response.json());
    guildData = response.data;
    channelData = response.data.channels.filter(
      (channel: GuildChannel) => channel.type === "0",
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
