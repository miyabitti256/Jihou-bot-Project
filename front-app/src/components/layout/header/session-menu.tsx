import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { auth } from "@/lib/auth";
import { signInAction } from "./actions";
import LogoutButton from "./logout-button";

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
      <DropdownMenuTrigger className="focus:outline-hidden">
        <Avatar>
          <AvatarImage
            src={session.user?.image ?? ""}
            alt="your discord icon"
          />
          <AvatarFallback>
            {session.user?.name?.slice(0, 2) ?? ""}
          </AvatarFallback>
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
