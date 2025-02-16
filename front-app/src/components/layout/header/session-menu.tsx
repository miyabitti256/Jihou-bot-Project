import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signInAction } from "./actions";
import Link from "next/link";
import LogoutButton from "./logout-button";
import { auth } from "@/lib/auth";

export default async function SessionMenu() {
  const session = await auth();

  if (!session) {
    return (
      <form action={signInAction}>
        <Button variant="outline">ログイン</Button>
      </form>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none">
        <Avatar>
          <AvatarImage src={session.user?.image ?? ""} />
          <AvatarFallback>{session.user?.name?.slice(0, 2) ?? ""}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>
          <Link href="/dashboard" className="w-full">
            ダッシュボード
          </Link>
        </DropdownMenuItem>
        <LogoutButton />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
