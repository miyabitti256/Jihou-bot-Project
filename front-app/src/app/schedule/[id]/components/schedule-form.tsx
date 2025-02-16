"use client";

import { startTransition, useActionState } from "react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createSchedule, updateSchedule } from "./actions";
import type { GuildChannel, ScheduledMessage } from "@/types/api-response";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

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

  return (
    <Card>
      <CardHeader className="space-y-6">
        <div className="flex flex-col items-center space-y-4">
          <CardTitle className="text-2xl font-bold">
            {isNew ? "定期メッセージの新規作成" : "定期メッセージの編集"}
          </CardTitle>
          <CardDescription className="text-center text-muted-foreground">
            {isNew
              ? "定期的に送信するメッセージを設定します"
              : "定期メッセージの設定を編集します"}
          </CardDescription>
        </div>

        <div className="flex items-center justify-center gap-4 p-4 bg-muted rounded-lg">
          {guildData.icon && (
            <Avatar className="h-12 w-12">
              <AvatarImage src={guildData.icon} alt={guildData.name} />
              <AvatarFallback>{guildData.name[0]}</AvatarFallback>
            </Avatar>
          )}
          <div className="flex flex-col">
            <span className="font-semibold">{guildData.name}</span>
            <span className="text-sm text-muted-foreground">
              サーバーID: {guildData.id}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-8"
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
                <FormItem>
                  <FormLabel>送信チャンネル</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="チャンネルを選択" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {channels?.map((channel) => (
                        <SelectItem key={channel.id} value={channel.id}>
                          #{channel.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
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

            <div className="flex justify-end gap-4">
              <Button
                variant="outline"
                type="button"
                onClick={() => history.back()}
              >
                キャンセル
              </Button>
              <Button type="submit" disabled={isPending}>
                {isNew ? "作成" : "更新"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
