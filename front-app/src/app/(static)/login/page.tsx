import Image from "next/image";
import { redirect } from "next/navigation";
import { FaDiscord } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { auth, signIn } from "@/lib/auth";

export default async function LoginPage() {
  const session = await auth();
  if (session) {
    redirect("/dashboard");
  }
  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center p-4 overflow-hidden">
      {/* Background styling similar to Discord's login page artwork/pattern */}
      <div className="absolute inset-0 bg-[#313338] -z-20 hidden dark:block" />
      <div className="absolute inset-0 bg-white -z-20 dark:hidden" />
      <div className="absolute inset-0 bg-[url('/images/discord-pattern.png')] opacity-5 -z-10" />

      <div className="mx-auto w-full max-w-md bg-white dark:bg-[#313338] rounded-lg shadow-2xl p-8 border border-gray-200 dark:border-white/5 text-center">
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="w-20 h-20 relative mb-4">
            <Image
              src="/images/clock-2.png"
              alt="Jihou Bot Logo"
              fill
              className="object-contain"
            />
          </div>
          <h1 className="text-2xl font-bold text-[#060607] dark:text-white tracking-tight">
            ダッシュボードへようこそ
          </h1>
          <p className="text-[#4E5058] dark:text-[#B5BAC1] mt-2 text-sm">
            ダッシュボードを利用するには、Discordアカウントでログインが必要です。
          </p>
        </div>

        <form
          action={async () => {
            "use server";
            try {
              await signIn("discord", { redirectTo: "/dashboard" });
            } catch (error) {
              if (
                error instanceof Error &&
                error.message.includes("NEXT_REDIRECT")
              ) {
                throw error;
              }
              // biome-ignore lint/suspicious/noConsole: ログインエラーはコンソールに出力する
              console.error("Sign in error:", error);
            }
          }}
          className="w-full"
        >
          <Button
            type="submit"
            className="w-full h-12 bg-[#5865F2] hover:bg-[#4752C4] text-white font-semibold text-lg rounded-md transition-colors"
          >
            <FaDiscord className="w-6 h-6 mr-2" />
            Discordでログイン
          </Button>
        </form>

        <div className="mt-8 text-xs text-[#4E5058] dark:text-[#949BA4]">
          <p>
            ログインすることで、
            <a
              href="/legal/terms"
              className="text-[#006CE7] dark:text-[#00A8FC] hover:underline"
            >
              利用規約
            </a>
            および
            <a
              href="/legal/privacy-policy"
              className="text-[#006CE7] dark:text-[#00A8FC] hover:underline"
            >
              プライバシーポリシー
            </a>
            に同意したものとみなされます。
          </p>
        </div>
      </div>
    </div>
  );
}
