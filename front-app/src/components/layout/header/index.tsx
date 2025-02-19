import SessionMenu from "./session-menu";
import Navigation from "./navigation";
import ToggleTheme from "./toggle-theme";
import Link from "next/link";

export default async function Header() {
  return (
    <header className="container mx-auto px-4 border-b border-gray-200">
      <div className="flex justify-between items-center h-16">
        <div className="flex items-center space-x-2">
          <div className="lg:hidden">
            <Navigation />
          </div>
          <h1 className="text-xl font-bold">
            <Link href="/">Jihou-Bot-App</Link>
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
