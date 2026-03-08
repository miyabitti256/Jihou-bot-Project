import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import { M_PLUS_Rounded_1c } from "next/font/google";
import GlobalSidebar from "@/components/layout/global-sidebar";
import { Toaster } from "@/components/ui/sonner";
import { env } from "@/lib/env";
import { ThemeProvider } from "@/provider/theme-provider";
import "./globals.css";

const m_plus_rounded_1c = M_PLUS_Rounded_1c({
  weight: ["400", "700", "800"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Jihou-Bot-App",
  description:
    "Discordサーバーを楽しく便利に。おみくじ、じゃんけん、コインフリップなどのミニゲームや、定期メッセージ配信機能を備えたDiscordボットの管理ダッシュボード",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body className={`${m_plus_rounded_1c.className} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Toaster position="top-center" />
          <div className="flex h-screen overflow-hidden bg-background">
            <GlobalSidebar />
            <div className="flex-1 flex flex-col overflow-y-auto">
              {children}
            </div>
          </div>
        </ThemeProvider>
        {env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  );
}
