"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
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
import { cn } from "@/lib/utils";

export default function ToggleTheme() {
  const { setTheme } = useTheme();

  return (
    <TooltipProvider>
      <DropdownMenu>
        <Tooltip delayDuration={50}>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger className="relative flex items-center justify-center w-full group focus:outline-hidden">
              <div
                className={cn(
                  "relative flex items-center justify-center w-12 h-12 transition-all duration-200 mx-auto overflow-hidden",
                  "rounded-[24px] bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 group-hover:rounded-[16px] group-hover:bg-indigo-500 group-hover:text-white shadow-sm dark:shadow-none",
                )}
              >
                <Sun className="h-6 w-6 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-6 w-6 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </div>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent side="right" className="font-semibold z-50">
            テーマ切替
          </TooltipContent>
        </Tooltip>
        <DropdownMenuContent align="end" side="right" sideOffset={14}>
          <DropdownMenuItem onClick={() => setTheme("light")}>
            ライト
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("dark")}>
            ダーク
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("system")}>
            システム
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </TooltipProvider>
  );
}
