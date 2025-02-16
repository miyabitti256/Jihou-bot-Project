import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import { ThemeProvider } from "@/provider/theme-provider";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import "./globals.css";
import ToastProvider from "@/provider/toast-provider";

const noto_sans_jp = Noto_Sans_JP({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Jihou-Bot-App",
  description: "Jihou-Bot-App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body className={`${noto_sans_jp.className} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ToastProvider />
          <Header />
          <main className="container mx-auto px-4">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
