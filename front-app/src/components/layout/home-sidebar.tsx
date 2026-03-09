import {
  Clock,
  FileText,
  Gamepad2,
  Home,
  Info,
  Mail,
  Shield,
  Users,
} from "lucide-react";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { cn } from "@/lib/utils";

export async function HomeSidebar() {
  const session = await auth();
  const isLoggedIn = !!session?.user?.id;

  const baseItems = [
    { id: "home", name: "ホーム", href: "/", icon: Home },
    { id: "about", name: "時報について", href: "/about", icon: Info },
    { id: "contact", name: "お問い合わせ", href: "/contact", icon: Mail },
    { id: "terms", name: "利用規約", href: "/legal/terms", icon: FileText },
    {
      id: "privacy",
      name: "プライバシーポリシー",
      href: "/legal/privacy-policy",
      icon: Shield,
    },
  ];

  const loggedInItems = isLoggedIn
    ? [
        { id: "schedule", name: "時報設定", href: "/schedule", icon: Clock },
        {
          id: "minigame",
          name: "ミニゲーム",
          href: "/minigame",
          icon: Gamepad2,
        },
        { id: "users", name: "ユーザー", href: "/users", icon: Users },
      ]
    : [];

  const homeItems = [...baseItems, ...loggedInItems];
  return (
    <div className="flex w-full h-full flex-col bg-gray-50 dark:bg-[#2b2d31]">
      <div className="flex h-12 items-center justify-between px-4 border-b border-gray-200 dark:border-gray-800 shadow-sm shadow-gray-200/50 dark:shadow-none">
        <h2 className="font-bold text-sm text-gray-800 dark:text-gray-100 truncate">
          ホーム
        </h2>
      </div>
      <nav className="flex-1 overflow-y-auto w-full p-2 space-y-[2px]">
        {homeItems.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-md group transition-colors",
              "text-gray-600 hover:text-gray-900 hover:bg-gray-200/50 dark:text-gray-300 dark:hover:text-gray-100 dark:hover:bg-white/10",
            )}
          >
            <item.icon className="w-5 h-5 opacity-70 group-hover:opacity-100" />
            <span className="font-semibold text-[15px]">{item.name}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
