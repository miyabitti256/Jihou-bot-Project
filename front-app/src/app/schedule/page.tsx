import Link from "next/link";
import { FaPlus } from "react-icons/fa";
import NoAuthRedirect from "@/components/noAuthRedirect";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { auth } from "@/lib/auth";
import { authenticatedFetch } from "@/lib/auth-api";
import type {
  GuildChannel,
  GuildMember,
  ScheduledMessage,
} from "@/types/api-response";
import DeleteButton from "./components/delete-button";

export default async function SchedulePage() {
  const session = await auth();
  if (!session) {
    return <NoAuthRedirect redirectPath="/" />;
  }

  const memberResponse = await authenticatedFetch(
    `${process.env.API_URL}/api/guilds/members/${session.user.id}`,
    {
      method: "GET",
    },
  );

  const memberData = await memberResponse.json().then((data) => data.data);
  const guildPromises = memberData.map((member: GuildMember) =>
    authenticatedFetch(
      `${process.env.API_URL}/api/guilds/${member.guildId}?includes=roles,channels,messages`,
      {
        method: "GET",
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
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                {guild.data.iconUrl && (
                  <Avatar className="rounded-full">
                    <AvatarImage src={guild.data.iconUrl} />
                    <AvatarFallback>
                      {guild.data.name.slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                )}
                <div>
                  <CardTitle className="text-lg sm:text-xl">
                    {guild.data.name}
                  </CardTitle>
                  <CardDescription className="text-sm">
                    メンバー数: {guild.data.memberCount}
                  </CardDescription>
                </div>
              </div>
              <Link href={`/schedule/new?guildId=${guild.data.id}`}>
                <Button className="w-full sm:w-auto">
                  <FaPlus className="h-2 w-2 mr-2" />
                  新規作成
                </Button>
              </Link>
            </div>
          </CardHeader>

          <CardContent>
            {guild.data.ScheduledMessage &&
              guild.data.ScheduledMessage.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px] md:w-auto">
                        メッセージ
                      </TableHead>
                      <TableHead className="min-w-[120px]">
                        チャンネル
                      </TableHead>
                      <TableHead className="min-w-[100px]">実行時間</TableHead>
                      <TableHead className="min-w-[120px]">
                        ステータス
                      </TableHead>
                      <TableHead className="min-w-[120px]">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {guild.data.ScheduledMessage.sort(
                      (a: ScheduledMessage, b: ScheduledMessage) =>
                        a.scheduleTime.localeCompare(b.scheduleTime),
                    ).map((message: ScheduledMessage) => (
                      <TableRow key={message.id}>
                        <TableCell className="max-w-[150px] whitespace-nowrap">
                          <Dialog>
                            <DialogTrigger asChild>
                              <button
                                type="button"
                                className="text-left w-full"
                              >
                                <div className="truncate max-w-[150px] md:max-w-xs block">
                                  {message.message}
                                </div>
                              </button>
                            </DialogTrigger>
                            <DialogContent className="max-w-[90vw] sm:max-w-[600px]">
                              <DialogHeader>
                                <DialogTitle className="text-xl font-bold">
                                  スケジュール詳細
                                </DialogTitle>
                              </DialogHeader>
                              <div className="mt-6 space-y-6">
                                <div className="">
                                  <h4 className="text-sm font-semibold mb-2">
                                    メッセージ内容
                                  </h4>
                                  <p className="wrap-break-word whitespace-pre-wrap text-base">
                                    {message.message}
                                  </p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-1">
                                    <h4 className="text-sm font-semibold text-muted-foreground">
                                      送信チャンネル
                                    </h4>
                                    <p className="text-base">
                                      #
                                      {
                                        guild.data.channels.find(
                                          (c: GuildChannel) =>
                                            c.id === message.channelId,
                                        )?.name
                                      }
                                    </p>
                                  </div>
                                  <div className="space-y-1">
                                    <h4 className="text-sm font-semibold text-muted-foreground">
                                      実行時間
                                    </h4>
                                    <p className="text-base">
                                      {message.scheduleTime}
                                    </p>
                                  </div>
                                  <div className="space-y-1">
                                    <h4 className="text-sm font-semibold text-muted-foreground">
                                      ステータス
                                    </h4>
                                    <p
                                      className={`text-base ${message.isActive ? "text-green-600" : "text-red-600"}`}
                                    >
                                      {message.isActive ? "🟢 有効" : "🔴 無効"}
                                    </p>
                                  </div>
                                  <div className="mt-4 flex justify-end gap-4">
                                    <Link href={`schedule/${message.id}`}>
                                      <Button variant="outline" size={"sm"}>
                                        編集
                                      </Button>
                                    </Link>
                                    <DeleteButton
                                      messageId={message.id}
                                      guildId={message.guildId}
                                    />
                                  </div>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </TableCell>

                        <TableCell className="whitespace-nowrap">
                          #
                          {guild.data.channels.find(
                            (c: GuildChannel) => c.id === message.channelId,
                          )?.name || "Unknown"}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {message.scheduleTime}
                        </TableCell>
                        <TableCell>
                          <span
                            className={
                              message.isActive
                                ? "text-green-600"
                                : "text-red-600"
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
              </div>
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
