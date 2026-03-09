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
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { signOutAction } from "./actions";

export default function LogoutButton() {
  return (
    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <button
            type="button"
            className="w-full text-left text-red-500 dark:text-red-400"
          >
            ログアウト
          </button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>ログアウトの確認</AlertDialogTitle>
            <AlertDialogDescription>
              本当にログアウトしますか？
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>キャンセル</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                const form = document.createElement("form");
                form.action = await signOutAction();
                form.method = "post";
                document.body.appendChild(form);
                form.submit();
              }}
              className="bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white"
            >
              ログアウト
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DropdownMenuItem>
  );
}
