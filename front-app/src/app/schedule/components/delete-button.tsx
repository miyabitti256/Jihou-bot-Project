"use client";

import { useRouter } from "next/navigation";
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
import { Button } from "@/components/ui/button";
import { messageDelete } from "./actions";

export default function DeleteButton({
  messageId,
  guildId,
}: {
  messageId: string;
  guildId: string;
}) {
  const router = useRouter();
  const handleDelete = async () => {
    interface DeleteResponse {
      data?: { message: string };
      error?: { message: string };
      message?: string;
    }

    toast.promise<DeleteResponse>(messageDelete(messageId, guildId), {
      loading: "削除中...",
      success: (response: DeleteResponse) => {
        if (response.data?.message) return response.data.message;
        if (response.message) return response.message;
        return "削除しました";
      },
      error: (error: unknown) => {
        if (
          error &&
          typeof error === "object" &&
          "error" in error &&
          error.error &&
          typeof error.error === "object" &&
          "message" in error.error
        )
          return String(error.error.message);
        if (error && typeof error === "object" && "message" in error)
          return String((error as Record<string, unknown>).message);
        return "削除中にエラーが発生しました";
      },
    });
    router.refresh();
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm">
          削除
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>定期メッセージを削除</AlertDialogTitle>
          <AlertDialogDescription>
            このメッセージを削除してもよろしいですか？
            この操作は取り消せません。
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>キャンセル</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>削除</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
