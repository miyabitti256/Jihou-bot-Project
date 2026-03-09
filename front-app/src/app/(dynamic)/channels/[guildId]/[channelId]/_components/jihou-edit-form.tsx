"use client";

import { Check, Clock, Power, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { toggleJihouActive, updateJihou } from "../actions";
import type { ScheduledMessage } from "./jihou-message";

interface JihouEditFormProps {
  message: ScheduledMessage;
  userId: string;
  channelId: string;
  onCancel: () => void;
  onSave: () => void;
}

export function JihouEditForm({
  message,
  userId,
  channelId,
  onCancel,
  onSave,
}: JihouEditFormProps) {
  const [editMessage, setEditMessage] = useState(message.message);
  const [editTime, setEditTime] = useState(message.scheduleTime);
  const [editActive, setEditActive] = useState(message.isActive);
  const [isPending, startTransition] = useTransition();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const handleSave = () => {
    if (!editMessage.trim()) {
      toast.error("メッセージを入力してください");
      return;
    }
    startTransition(async () => {
      try {
        const result = await updateJihou({
          id: message.id,
          message: editMessage,
          scheduleTime: editTime,
          guildId: message.guildId,
          userId,
          channelId,
          isActive: editActive,
        });
        if (result && "error" in result) {
          toast.error(result.error.message);
        } else {
          toast.success("時報を更新しました");
          onSave();
        }
      } catch {
        toast.error("更新中にエラーが発生しました");
      }
    });
  };

  const handleToggleActive = () => {
    const newActive = !editActive;
    setEditActive(newActive);
    startTransition(async () => {
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
      } catch {
        setEditActive(!newActive);
        toast.error("更新中にエラーが発生しました");
      }
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onCancel();
    }
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    }
  };

  return (
    <div
      className={cn(
        "flex gap-4 px-4 py-2 bg-yellow-50/50 dark:bg-yellow-900/5",
        !editActive && "opacity-60",
      )}
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

      {/* Edit Content */}
      <div className="flex-1 min-w-0 space-y-2">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-[15px] text-[#5865F2]">
            時報G
          </span>
          <span className="text-xs px-1.5 py-0.5 rounded bg-[#5865F2] text-white font-medium">
            アプリ
          </span>
          <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">
            編集中
          </span>
        </div>

        {/* Time + Active Row */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <input
              type="time"
              value={editTime}
              onChange={(e) => setEditTime(e.target.value)}
              className={cn(
                "px-2 py-1 text-sm rounded border",
                "border-gray-300 dark:border-gray-600",
                "bg-white dark:bg-[#383a40]",
                "text-gray-800 dark:text-gray-200",
                "focus:outline-none focus:ring-2 focus:ring-[#5865F2]",
              )}
            />
          </div>
          {/* isActive toggle */}
          <button
            type="button"
            onClick={handleToggleActive}
            disabled={isPending}
            className={cn(
              "text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1.5 transition-colors cursor-pointer",
              editActive
                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50"
                : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50",
              isPending && "opacity-50",
            )}
          >
            <Power className="w-3 h-3" />
            {editActive ? "有効" : "無効"}
          </button>
        </div>

        {/* Message Textarea */}
        <textarea
          value={editMessage}
          onChange={(e) => setEditMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          className={cn(
            "w-full px-3 py-2 text-[15px] rounded-lg resize-none",
            "border border-gray-300 dark:border-gray-600",
            "bg-white dark:bg-[#383a40]",
            "text-gray-800 dark:text-gray-200",
            "placeholder:text-gray-400",
            "focus:outline-none focus:ring-2 focus:ring-[#5865F2]",
          )}
          rows={3}
          maxLength={200}
          ref={textareaRef}
        />

        {/* Actions */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">
            Escapeで
            <button
              type="button"
              onClick={onCancel}
              className="text-blue-500 hover:underline cursor-pointer"
            >
              キャンセル
            </button>{" "}
            • Enterで
            <button
              type="button"
              onClick={handleSave}
              className="text-blue-500 hover:underline cursor-pointer"
            >
              保存
            </button>
          </span>
          <div className="flex-1" />
          <button
            type="button"
            onClick={onCancel}
            className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 transition-colors"
            title="キャンセル"
          >
            <X className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isPending}
            className={cn(
              "p-1 rounded transition-colors",
              "text-green-600 hover:bg-green-100 dark:text-green-400 dark:hover:bg-green-900/30",
              isPending && "opacity-50 cursor-not-allowed",
            )}
            title="保存"
          >
            <Check className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
