import Link from "next/link";
import Navigation from "./navigation";
import SessionMenu from "./session-menu";
import ToggleTheme from "./toggle-theme";

export default async function Header() {
  return (
    <header className="container mx-auto px-4 border-b border-gray-200">
      <div className="flex justify-between items-center h-16">
        <div className="flex items-center space-x-2">
          <div className="lg:hidden">
            <Navigation />
          </div>
          <h1 className="text-xl font-bold">
            <Link href="/">Jihou Bot</Link>
          </h1>
        </div>
        <div className="hidden lg:block">
          <Navigation />
        </div>
        <div className="flex items-center space-x-4">
          <SessionMenu />
          <ToggleTheme />
        </div>
      </div>
    </header>
  );
}
