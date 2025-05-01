"use client";

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
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { GuildChannel, ScheduledMessage } from "@/types/api-response";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { startTransition, useActionState } from "react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";
import { createSchedule, updateSchedule } from "./actions";

const formSchema = z.object({
  message: z
    .string()
    .min(1, "メッセージを入力してください")
    .max(200, "メッセージは200文字以内で入力してください"),
  channelId: z.string().min(1, "チャンネルを選択してください"),
  scheduleTime: z
    .string()
    .regex(/^([0-9]{1,2}:[0-9]{2})$/, "正しい時刻形式で入力してください"),
  isActive: z.boolean().default(true).optional(),
});

type FormData = z.infer<typeof formSchema>;

interface ScheduleFormProps {
  initialData: ScheduledMessage | null;
  isNew: boolean;
  guildData: { name: string; id: string; icon: string };
  channels: GuildChannel[] | null;
  userId: string;
}

export function ScheduleForm({
  initialData,
  isNew,
  guildData,
  channels,
  userId,
}: ScheduleFormProps) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(
    isNew ? createSchedule : updateSchedule,
    {
      success: false,
      data: null,
      error: null,
    },
  );

  const handleSubmit = (data: FormData) => {
    const formDataToSend = new FormData();
    interface FormValues {
      id?: string;
      channelId: string;
      message: string;
      scheduleTime: string;
      guildId: string;
      userId: string;
      isActive?: boolean;
    }

    const values: FormValues = {
      ...(isNew ? {} : { id: initialData?.id || "" }),
      channelId: data.channelId,
      message: data.message,
      scheduleTime: data.scheduleTime,
      guildId: guildData.id,
      userId: userId,
      isActive: data.isActive,
    };

    for (const [key, value] of Object.entries(values)) {
      if (value !== undefined) {
        formDataToSend.append(key, String(value));
      }
    }

    startTransition(() => {
      toast.promise(
        async () => {
          formAction(formDataToSend);
          router.push("/schedule");
        },
        {
          loading: "送信中...",
          success: state.success
            ? state.data?.message
            : "メッセージの設定に成功しました",
          error: state.error?.message ?? "エラーが発生しました",
        },
      );
    });
  };

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: initialData?.message ?? "",
      channelId: initialData?.channelId ?? "",
      scheduleTime: initialData?.scheduleTime ?? "",
      isActive: initialData?.isActive ?? true,
    },
  });

  const [filteredChannels, setFilteredChannels] = useState(channels);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (searchQuery) {
      const filtered = channels?.filter((channel) =>
        channel.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setFilteredChannels(filtered ?? null);
    } else {
      setFilteredChannels(channels ?? null);
    }
  }, [channels, searchQuery]);

  return (
    <Card className="w-full max-w-[95vw] sm:max-w-[600px] mx-auto">
      <CardHeader className="space-y-4 sm:space-y-6">
        <div className="flex flex-col items-center space-y-2 sm:space-y-4">
          <CardTitle className="text-xl sm:text-2xl font-bold text-center">
            {isNew ? "定期メッセージの新規作成" : "定期メッセージの編集"}
          </CardTitle>
          <CardDescription className="text-center text-sm sm:text-base text-muted-foreground">
            {isNew
              ? "定期的に送信するメッセージを設定します"
              : "定期メッセージの設定を編集します"}
          </CardDescription>
        </div>

        <div className="flex items-center justify-center gap-3 sm:gap-4 p-3 sm:p-4 bg-muted rounded-lg">
          {guildData.icon && (
            <Avatar className="h-10 w-10 sm:h-12 sm:w-12">
              <AvatarImage src={guildData.icon} alt={guildData.name} />
              <AvatarFallback>{guildData.name[0]}</AvatarFallback>
            </Avatar>
          )}
          <div className="flex flex-col">
            <span className="font-semibold text-sm sm:text-base">
              {guildData.name}
            </span>
            <span className="text-xs sm:text-sm text-muted-foreground">
              サーバーID: {guildData.id}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6 sm:space-y-8"
          >
            <FormField
              control={form.control}
              name="scheduleTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>実行時間</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                  <FormDescription>
                    メッセージを送信する時刻を設定してください
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>メッセージ内容</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="送信するメッセージを入力してください"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Discordのマークダウンが使用できます
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="channelId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>送信チャンネル</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          // biome-ignore lint/a11y/useSemanticElements: <explanation>
                          role="combobox"
                          className={cn(
                            "w-full justify-between",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value
                            ? channels?.find(
                                (channel) => channel.id === field.value,
                              )?.name
                            : "チャンネルを選択"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[400px] p-0">
                      <div className="flex flex-col">
                        <div className="p-2">
                          <div className="relative">
                            <Input
                              placeholder="チャンネルを検索..."
                              className="w-full pr-8"
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            {searchQuery && (
                              <button
                                type="button"
                                onClick={() => setSearchQuery("")}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </div>
                        <div className="max-h-[300px] overflow-y-auto">
                          {filteredChannels && filteredChannels.length > 0 ? (
                            <div className="p-1">
                              {filteredChannels
                                .slice()
                                .sort((a, b) => a.name.localeCompare(b.name))
                                .map((channel) => (
                                  <div
                                    key={channel.id}
                                    // biome-ignore lint/a11y/useSemanticElements: <explanation>
                                    role="button"
                                    tabIndex={0}
                                    className={cn(
                                      "flex items-center px-2 py-1.5 cursor-pointer rounded-sm hover:bg-accent",
                                      channel.id === field.value && "bg-accent",
                                    )}
                                    onClick={() => {
                                      form.setValue("channelId", channel.id);
                                    }}
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter" || e.key === " ") {
                                        form.setValue("channelId", channel.id);
                                      }
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        channel.id === field.value
                                          ? "opacity-100"
                                          : "opacity-0",
                                      )}
                                    />
                                    <span className="flex-1">
                                      #{channel.name}
                                    </span>
                                  </div>
                                ))}
                            </div>
                          ) : (
                            <div className="p-2 text-sm text-muted-foreground">
                              チャンネルが見つかりません
                            </div>
                          )}
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {isNew ? (
              <></>
            ) : (
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-col sm:flex-row items-start sm:items-center justify-between rounded-lg border p-3 sm:p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        メッセージの有効化
                      </FormLabel>
                      <FormDescription>
                        このメッセージの送信を有効/無効にします
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            )}

            <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4">
              <Button
                variant="outline"
                type="button"
                onClick={() => history.back()}
                className="w-full sm:w-auto"
              >
                キャンセル
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="w-full sm:w-auto"
              >
                {isNew ? "作成" : "更新"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
