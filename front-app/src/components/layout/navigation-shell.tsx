"use client";

import { ArrowLeft, Search } from "lucide-react";
import { useParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useChannelContext } from "@/components/provider/channel-context";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface NavigationShellProps {
  globalSidebar: React.ReactNode;
  sidebar: React.ReactNode;
  children: React.ReactNode;
}

export function NavigationShell({
  globalSidebar,
  sidebar,
  children,
}: NavigationShellProps) {
  const pathname = usePathname();
  const params = useParams();
  const [isMobile, setIsMobile] = useState(false);
  const [open, setOpen] = useState(false);
  const { channelName } = useChannelContext();

  const pathParts = pathname.split("/").filter(Boolean);
  const isChannelRoute = pathParts[0] === "channels" && pathParts.length >= 2;
  const currentChannelId = (params?.channelId as string) || "general";

  useEffect(() => {
    const checkIsMobile = () => setIsMobile(window.innerWidth < 768);
    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  // パスが変更されたらモバイル用のドロワーを閉じるか判定する
  useEffect(() => {
    const pathParts = pathname.split("/").filter(Boolean);

    // `/channels/[guildId]` のようなルートは第2階層(チャンネル一覧)を表示するためのルートなので閉じない
    const isServerRoot = pathParts[0] === "channels" && pathParts.length === 2;
    // `/` はホームの第2階層表示のルートなので閉じない
    const isHomeRoot = pathParts.length === 0;

    if (!isServerRoot && !isHomeRoot) {
      setOpen(false);
    }
  }, [pathname]);

  // サイドバー内のリンククリックを検知して、現在のパスと同じでも条件を満たせばドロワーを閉じる
  const handleSidebarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const link = target.closest("a");
    if (!link) return;

    const href = link.getAttribute("href");
    if (!href) return;

    // グローバルサイドバーのホームアイコン等からの遷移かどうかを判定するため、クリック元を特定する
    // HomeSidebar内のリンクには共通のクラスなどがないので、hrefで判定する
    const isClickFromGlobalSidebar = target.closest(".w-\\[72px\\]");

    const pathParts = href.split("?")[0].split("/").filter(Boolean);
    const isServerRoot = pathParts[0] === "channels" && pathParts.length === 2;
    // グローバルサイドバーのホーム(/)をクリックした場合はドロワーを閉じないが、
    // 第二サイドバーの「ホーム」(/)をクリックした場合はドロワーを閉じる
    const isHomeRoot = pathParts.length === 0 && isClickFromGlobalSidebar;

    if (!isServerRoot && !isHomeRoot) {
      setOpen(false);
    }
  };

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <div className="flex h-screen overflow-hidden bg-background">
          {/* Mobile Header (Hamburger Menu) */}
          <SheetContent
            side="left"
            className="p-0 flex border-none bg-transparent shadow-none w-full max-w-full sm:max-w-full [&>button]:right-6 [&>button]:top-4 [&>button]:text-gray-500 [&>button]:z-60"
            onOpenAutoFocus={(e) => e.preventDefault()}
          >
            <SheetTitle className="sr-only">ナビゲーションメニュー</SheetTitle>
            <SheetDescription className="sr-only">
              ナビゲーションメニュー
            </SheetDescription>
            {/* biome-ignore lint/a11y/noStaticElementInteractions: This is an event delegation wrapper for anchor tags inside. */}
            {/* biome-ignore lint/a11y/useKeyWithClickEvents: This is an event delegation wrapper for anchor tags inside. */}
            <div
              className="flex h-full w-full bg-gray-100 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 shadow-2xl relative"
              onClick={handleSidebarClick}
            >
              {/* 第1階層：サーバー一覧 */}
              <div className="w-[72px] shrink-0 border-r border-gray-200 dark:border-gray-800">
                {globalSidebar}
              </div>
              {/* 第2階層：DM、もしくはチャンネル一覧 */}
              <div className="flex-1 w-full overflow-hidden">{sidebar}</div>
            </div>
          </SheetContent>

          <div className="flex-1 flex flex-col overflow-hidden w-full">
            {/* Mobile Header (Now inside NavigationShell to share Sheet context) */}
            <header className="flex h-12 items-center px-4 border-b border-gray-200 dark:border-gray-800 shadow-sm shrink-0">
              <div className="flex items-center mr-2">
                <SheetTrigger asChild>
                  <button
                    type="button"
                    className="p-1 -ml-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                  >
                    <ArrowLeft className="w-6 h-6" />
                  </button>
                </SheetTrigger>
              </div>
              {isChannelRoute ? (
                <>
                  <h2 className="font-bold text-base text-gray-800 dark:text-gray-100 flex-1 truncate">
                    {channelName ||
                      (currentChannelId === "general"
                        ? "一般"
                        : currentChannelId)}
                  </h2>
                  <button
                    type="button"
                    className="p-2 ml-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                  >
                    <Search className="w-5 h-5" />
                  </button>
                </>
              ) : (
                <h2 className="font-bold text-base text-gray-800 dark:text-gray-100 flex-1 truncate">
                  時報Bot ホーム
                </h2>
              )}
            </header>

            <div className="flex-1 overflow-y-auto min-h-0">{children}</div>
          </div>
        </div>
      </Sheet>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop Layout: 3-column architecture */}
      <div className="w-[72px] shrink-0 border-r border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-900 border-none">
        {globalSidebar}
      </div>
      {sidebar && (
        <div className="w-60 shrink-0 border-r border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950">
          {sidebar}
        </div>
      )}
      <div className="flex-1 flex flex-col overflow-y-auto min-h-0">
        {children}
      </div>
    </div>
  );
}
