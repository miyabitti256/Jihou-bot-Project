"use client";

import { Clock, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { createJihou } from "../actions";

interface JihouInputBarProps {
  guildId: string;
  channelId: string;
  channelName: string;
  userId: string;
}

export function JihouInputBar({
  guildId,
  channelId,
  channelName,
  userId,
}: JihouInputBarProps) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async () => {
    if (!message.trim()) {
      toast.error("メッセージを入力してください");
      return;
    }
    if (!scheduleTime) {
      toast.error("実行時間を設定してください");
      return;
    }

    setIsSending(true);
    try {
      const result = await createJihou({
        channelId,
        message: message.trim(),
        scheduleTime,
        guildId,
        userId,
      });

      if (result && "error" in result) {
        toast.error(result.error.message);
      } else {
        toast.success("時報を追加しました");
        setMessage("");
        setScheduleTime("");
        router.refresh();
      }
    } catch {
      toast.error("送信中にエラーが発生しました");
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="px-4 pb-6 pt-2 shrink-0">
      {/* 時刻設定行 (常に表示) */}
      <div className="flex items-center gap-2 mb-2 px-1">
        <Clock className="w-4 h-4 text-gray-400 dark:text-gray-500" />
        <label
          htmlFor="jihou-time-input"
          className="text-sm text-gray-500 dark:text-gray-400"
        >
          配信時刻:
        </label>
        <input
          id="jihou-time-input"
          type="time"
          value={scheduleTime}
          onChange={(e) => setScheduleTime(e.target.value)}
          className={cn(
            "px-2 py-1 text-sm rounded-md",
            "border border-gray-300 dark:border-gray-600",
            "bg-white dark:bg-[#383a40]",
            "text-gray-800 dark:text-gray-200",
            "focus:outline-none focus:ring-2 focus:ring-[#5865F2]",
            !scheduleTime && "text-gray-400",
          )}
        />
        {scheduleTime && (
          <span className="text-xs text-gray-400 dark:text-gray-500">
            毎日 {scheduleTime} に送信されます
          </span>
        )}
      </div>

      {/* メッセージ入力バー */}
      <div
        className={cn(
          "flex items-end gap-0 rounded-lg",
          "bg-gray-100 dark:bg-[#383a40]",
          "border border-gray-200 dark:border-gray-700",
          "focus-within:ring-1 focus-within:ring-[#5865F2]/50",
          "transition-shadow",
        )}
      >
        {/* Message input */}
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`#${channelName} に時報を追加`}
          rows={1}
          maxLength={200}
          className={cn(
            "flex-1 py-3 px-3 bg-transparent resize-none",
            "text-[15px] text-gray-800 dark:text-gray-200",
            "placeholder:text-gray-400 dark:placeholder:text-gray-500",
            "focus:outline-none",
            "min-h-[24px] max-h-[200px]",
          )}
          style={{
            height: "auto",
            overflow: "hidden",
          }}
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement;
            target.style.height = "auto";
            target.style.height = `${Math.min(target.scrollHeight, 200)}px`;
          }}
        />

        {/* Send button */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSending || !message.trim() || !scheduleTime}
          className={cn(
            "shrink-0 p-3 rounded-r-lg transition-colors",
            message.trim() && scheduleTime
              ? "text-[#5865F2] hover:text-[#4752c4] cursor-pointer"
              : "text-gray-400 cursor-not-allowed",
            isSending && "opacity-50",
          )}
          title="送信"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
      <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1 px-1">
        {message.length}/200文字
      </p>
    </div>
  );
}
