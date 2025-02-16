"use client";

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
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function DeleteButton({
  messageId,
  guildId,
}: { messageId: string; guildId: string }) {
  const router = useRouter();
  const handleDelete = async () => {
    interface DeleteResponse {
      data: { message: string };
      error: { message: string };
    }

    toast.promise<DeleteResponse>(
      messageDelete(messageId, guildId),
      {
      loading: "削除中...",
      success: (response: DeleteResponse) => response.data.message,
      error: (response: DeleteResponse) => response.error.message
      }
    );
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
