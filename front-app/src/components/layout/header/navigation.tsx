"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

type NavItem = {
  href: string;
  label: string;
};

const navItems: NavItem[] = [
  { href: "/", label: "ホーム" },
  { href: "/about", label: "時報について" },
  { href: "/schedule", label: "時報設定" },
  { href: "/minigame", label: "ミニゲーム" },
  { href: "/users", label: "ユーザー" },
  { href: "/contact", label: "お問い合わせ" },
];

export default function Navigation() {
  const pathname = `/${usePathname().split("/")[1]}`;
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <nav className="hidden lg:block">
        <NavigationMenu>
          <NavigationMenuList className="flex space-x-4 items-center">
            {navItems.map(({ href, label }) => (
              <NavigationMenuItem key={href}>
                <Link
                  href={href}
                  className={`hover:text-gray-600 dark:hover:text-gray-400 transition-colors px-3 py-2 ${
                    pathname === href
                      ? "border-b-2 border-gray-800 dark:border-gray-200"
                      : ""
                  }`}
                >
                  {label}
                </Link>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </nav>

      <div className="lg:hidden">
        <DropdownMenu onOpenChange={(open) => setIsOpen(open)}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            {navItems.map(({ href, label }) => (
              <DropdownMenuItem key={href} asChild>
                <Link
                  href={href}
                  className={`w-full ${
                    pathname === href
                      ? "font-semibold text-primary"
                      : "text-gray-600 dark:text-gray-400"
                  }`}
                >
                  {label}
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
}
