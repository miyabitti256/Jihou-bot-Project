"use client";

import { Clock, Copy, Edit2, Power, Trash2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useOptimistic, useState, useTransition } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { deleteJihou, toggleJihouActive } from "../actions";
import { JihouEditForm } from "./jihou-edit-form";

export interface ScheduledMessage {
  id: string;
  message: string;
  channelId: string;
  scheduleTime: string;
  guildId: string;
  isActive: boolean;
  createdUserId?: string;
}

interface JihouMessageProps {
  message: ScheduledMessage;
  userId: string;
  channelId: string;
}

export function JihouMessage({
  message,
  userId,
  channelId,
}: JihouMessageProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [optimisticActive, setOptimisticActive] = useOptimistic(
    message.isActive,
  );

  const handleDelete = () => {
    startTransition(async () => {
      try {
        await deleteJihou(message.id, message.guildId, channelId);
        toast.success("時報を削除しました");
        router.refresh();
      } catch {
        toast.error("削除中にエラーが発生しました");
      }
    });
  };

  const handleToggleActive = () => {
    const newActive = !optimisticActive;
    startTransition(async () => {
      setOptimisticActive(newActive);
      try {
        await toggleJihouActive({
          id: message.id,
          guildId: message.guildId,
          userId,
          channelId,
          isActive: newActive,
        });
        toast.success(
          newActive ? "時報を有効にしました" : "時報を無効にしました",
        );
        router.refresh();
      } catch {
        toast.error("更新中にエラーが発生しました");
      }
    });
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(message.id);
    toast.success("IDをコピーしました");
  };

  if (isEditing) {
    return (
      <JihouEditForm
        message={message}
        userId={userId}
        channelId={channelId}
        onCancel={() => setIsEditing(false)}
        onSave={() => setIsEditing(false)}
      />
    );
  }

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: hover state tracking for action bar display
    <div
      className={cn(
        "group relative flex gap-4 px-4 py-2 transition-colors",
        "hover:bg-gray-100/50 dark:hover:bg-[#2e3035]",
        !optimisticActive && "opacity-60",
        isPending && "pointer-events-none",
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Bot Avatar */}
      <div className="shrink-0 mt-0.5">
        <div className="w-10 h-10 rounded-full flex items-center justify-center">
          <Image
            src={"/images/clock-2.png"}
            width={40}
            height={40}
            alt="clock"
          />
        </div>
      </div>

      {/* Message Content */}
      <div className="flex-1 min-w-0">
        {/* Username + Time + Status */}
        <div className="flex items-center gap-2 mb-1">
          <span className="font-semibold text-[15px] text-[#5865F2]">
            時報G
          </span>
          <span className="text-xs px-1.5 py-0.5 rounded bg-[#5865F2] text-white font-medium">
            アプリ
          </span>
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {message.scheduleTime}
          </span>
          <button
            type="button"
            onClick={handleToggleActive}
            disabled={isPending}
            className={cn(
              "text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1 transition-colors cursor-pointer",
              optimisticActive
                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50"
                : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50",
              isPending && "opacity-50",
            )}
          >
            <Power className="w-3 h-3" />
            {optimisticActive ? "有効" : "無効"}
          </button>
        </div>

        {/* Message Body */}
        <p className="text-[15px] text-gray-800 dark:text-gray-200 whitespace-pre-wrap wrap-break-word leading-relaxed">
          {message.message}
        </p>

        {/* Message Footer - ID */}
        <div className="flex items-center gap-2 mt-1.5">
          <button
            type="button"
            onClick={handleCopyId}
            className="text-[11px] text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Copy className="w-3 h-3" />
            ID: {message.id}
          </button>
        </div>
      </div>

      {/* Hover Action Bar */}
      {isHovered && (
        <div className="absolute -top-3 right-4 flex items-center bg-white dark:bg-[#2b2d31] border border-gray-200 dark:border-gray-700 rounded-md shadow-md overflow-hidden z-10">
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="p-1.5 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title="編集"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button
                type="button"
                className="p-1.5 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                title="削除"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>時報を削除</AlertDialogTitle>
                <AlertDialogDescription>
                  この時報（{message.scheduleTime}）を削除してもよろしいですか？
                  この操作は取り消せません。
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>キャンセル</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  削除
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}
    </div>
  );
}
