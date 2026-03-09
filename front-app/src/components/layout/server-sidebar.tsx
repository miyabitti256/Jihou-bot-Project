"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export type ServerIconItem = {
  id: string;
  name: string;
  href: string;
  icon?: React.ReactNode;
  iconUrl?: string;
  isSeparator?: boolean;
};

interface ServerSidebarProps {
  items: ServerIconItem[];
  bottomContent?: React.ReactNode;
}

export function ServerSidebar({ items, bottomContent }: ServerSidebarProps) {
  const pathname = usePathname();

  const SidebarContent = () => (
    <div className="flex-1 w-full flex flex-col items-center gap-2 overflow-y-auto no-scrollbar py-3">
      <TooltipProvider>
        <div className="flex w-full flex-col items-center gap-2 flex-1">
          {items.map((item) => {
            if (item.isSeparator) {
              return (
                <div
                  key={item.id}
                  className="h-[2px] w-8 bg-gray-300 dark:bg-gray-700 rounded-full mx-auto my-1 transition-colors"
                />
              );
            }

            // ホームアイコンの場合は、/ 以下だけでなく関連する静的パスでもアクティブにする
            const isStaticHomeRoute =
              item.href === "/" &&
              (pathname === "/" ||
                pathname === "/about" ||
                pathname === "/contact" ||
                pathname === "/legal/terms" ||
                pathname === "/legal/privacy-policy" ||
                pathname === "/schedule" ||
                pathname === "/minigame" ||
                pathname === "/users");

            const isActive =
              isStaticHomeRoute ||
              (item.href !== "/" && pathname.startsWith(item.href));

            return (
              <div
                key={item.id}
                className="relative flex items-center justify-center w-full group"
              >
                {/* Active/Hover Indicator */}
                <div
                  className={cn(
                    "absolute left-0 bg-gray-900 dark:bg-white rounded-r-full transition-all duration-200 w-1",
                    isActive
                      ? "h-10"
                      : "h-2 scale-0 group-hover:scale-100 group-hover:h-5",
                  )}
                />

                <Tooltip delayDuration={50}>
                  <TooltipTrigger asChild>
                    <Link href={item.href}>
                      <div
                        className={cn(
                          "relative flex items-center justify-center w-12 h-12 transition-all duration-200 mx-auto overflow-hidden",
                          isActive
                            ? "rounded-[16px]"
                            : "rounded-[24px] group-hover:rounded-[16px]",
                          !item.iconUrl &&
                            (isActive
                              ? "bg-indigo-500 text-white"
                              : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 group-hover:bg-indigo-500 group-hover:text-white shadow-sm dark:shadow-none"),
                        )}
                      >
                        {item.iconUrl ? (
                          <div className="relative w-full h-full">
                            <Image
                              src={item.iconUrl}
                              alt={item.name}
                              fill
                              sizes="48px"
                              className="object-cover"
                            />
                          </div>
                        ) : item.icon ? (
                          item.icon
                        ) : (
                          <span className="font-semibold text-lg">
                            {item.name.slice(0, 1)}
                          </span>
                        )}
                      </div>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="font-semibold z-50">
                    {item.name}
                  </TooltipContent>
                </Tooltip>
              </div>
            );
          })}
        </div>
        {bottomContent && (
          <div className="mt-auto flex flex-col items-center gap-4 pt-4 pb-2 w-full">
            {bottomContent}
          </div>
        )}
      </TooltipProvider>
    </div>
  );

  return (
    <nav className="flex h-screen w-full flex-col items-center py-3 bg-gray-100 dark:bg-gray-900 border-none transition-colors">
      <SidebarContent />
    </nav>
  );
}
