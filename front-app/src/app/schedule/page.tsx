import NoAuthRedirect from "@/components/noAuthRedirect";
import { auth } from "@/lib/auth";
import type {
  GuildChannel,
  GuildMember,
  ScheduledMessage,
} from "@/types/api-response";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FaPlus } from "react-icons/fa";
import DeleteButton from "./components/delete-button";

export default async function SchedulePage() {
  const session = await auth();
  if (!session) {
    return <NoAuthRedirect redirectPath="/" />;
  }

  const memberResponse = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/guilds/members/${session.user.id}`,
    {
      method: "GET",
      headers: {
        "X-API-Key": process.env.API_KEY as string,
      },
    },
  );

  const memberData = await memberResponse.json().then((data) => data.data);
  const guildPromises = memberData.map((member: GuildMember) =>
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/guilds/${member.guildId}?includes=roles,channels,messages`,
      {
        method: "GET",
        headers: {
          "X-API-Key": process.env.API_KEY as string,
        },
      },
    ).then((res) => res.json()),
  );

  const guildsData = await Promise.all(guildPromises);

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">時報設定</h1>
      </div>
      {guildsData.map((guild) => (
        <Card key={guild.data.id} className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {guild.data.iconUrl && (
                  <img
                    src={guild.data.iconUrl}
                    alt={guild.data.name}
                    className="w-12 h-12 rounded-full"
                  />
                )}
                <div>
                  <CardTitle>{guild.data.name}</CardTitle>
                  <CardDescription>
                    メンバー数: {guild.data.memberCount}
                  </CardDescription>
                </div>
              </div>
              <Link href={`/schedule/new?guildId=${guild.data.id}`}>
                <Button>
                  <FaPlus className="h-2 w-2 mr-2" />
                  新規作成
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {guild.data.ScheduledMessage &&
            guild.data.ScheduledMessage.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>メッセージ</TableHead>
                    <TableHead>チャンネル</TableHead>
                    <TableHead>実行時間</TableHead>
                    <TableHead>ステータス</TableHead>
                    <TableHead>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {guild.data.ScheduledMessage.sort(
                    (a: ScheduledMessage, b: ScheduledMessage) =>
                      a.scheduleTime.localeCompare(b.scheduleTime),
                  ).map((message: ScheduledMessage) => (
                    <TableRow key={message.id}>
                      <TableCell className="max-w-xs truncate">
                        {message.message}
                      </TableCell>
                      <TableCell>
                        #
                        {guild.data.channels.find(
                          (c: GuildChannel) => c.id === message.channelId,
                        )?.name || "Unknown"}
                      </TableCell>
                      <TableCell>{message.scheduleTime}</TableCell>

                      <TableCell>
                        <span
                          className={
                            message.isActive ? "text-green-600" : "text-red-600"
                          }
                        >
                          {message.isActive ? "🟢" : "🔴"}
                          {message.isActive ? "有効" : "無効"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Link href={`schedule/${message.id}`}>
                            <Button variant="outline" size="sm">
                              編集
                            </Button>
                          </Link>
                          <DeleteButton
                            messageId={message.id}
                            guildId={message.guildId}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-center text-gray-500 py-4">
                予定されているメッセージはありません
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
