import Link from "next/link";
import { Button } from "../ui/button";

export default function Footer() {
  return (
    <footer className="container mx-auto px-4 border-t border-gray-200">
      <div className="flex justify-center items-center h-16">
        <Button variant="link" asChild>
          <Link href="/legal/terms">利用規約</Link>
        </Button>
        <Button variant="link" asChild>
          <Link href="/legal/privacy-policy">プライバシーポリシー</Link>
        </Button>
      </div>
      <div className="flex justify-center items-center">
        <p className="text-sm text-gray-500">© 2025 miyabitti</p>
      </div>
    </footer>
  );
}
