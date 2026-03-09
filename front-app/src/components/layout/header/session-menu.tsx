import { LogIn } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { auth } from "@/lib/auth";
import LogoutButton from "./logout-button";

export default async function SessionMenu() {
  const session = await auth();

  if (!session) {
    return (
      <TooltipProvider>
        <Tooltip delayDuration={50}>
          <TooltipTrigger asChild>
            <Link href={"/login"}>
              <div className="relative flex items-center justify-center w-12 h-12 transition-all duration-200 mx-auto overflow-hidden rounded-[24px] bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 group-hover:rounded-[16px] group-hover:bg-indigo-500 group-hover:text-white shadow-sm dark:shadow-none">
                <LogIn className="w-6 h-6 text-green-300" />
              </div>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right" className="font-semibold z-50">
            ログイン
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider>
      <DropdownMenu>
        <Tooltip delayDuration={50}>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger className="relative flex items-center justify-center w-full group focus:outline-hidden">
              <div className="relative flex items-center justify-center w-12 h-12 transition-all duration-200 mx-auto overflow-hidden rounded-[24px] group-hover:rounded-[16px]">
                <Avatar className="w-full h-full rounded-none">
                  <AvatarImage
                    src={session.user?.image ?? ""}
                    alt="your discord icon"
                    className="object-cover"
                  />
                  <AvatarFallback className="rounded-none bg-gray-800 text-gray-300 font-bold group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                    {session.user?.name?.slice(0, 2) ?? ""}
                  </AvatarFallback>
                </Avatar>
              </div>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent side="right" className="font-semibold z-50">
            ユーザーメニュー
          </TooltipContent>
        </Tooltip>
        <DropdownMenuContent align="end" side="right" sideOffset={14}>
          <DropdownMenuItem>
            <Link href="/dashboard" className="w-full">
              ダッシュボード
            </Link>
          </DropdownMenuItem>
          <LogoutButton />
        </DropdownMenuContent>
      </DropdownMenu>
    </TooltipProvider>
  );
}
