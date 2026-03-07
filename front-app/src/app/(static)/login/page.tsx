import { FaDiscord } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { signIn } from "@/lib/auth";

export default function LoginPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
      <Card className="mx-auto max-w-sm w-full text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <FaDiscord className="h-12 w-12 text-[#5865F2]" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">
            Jihou Bot
          </CardTitle>
          <CardDescription>
            ダッシュボードを利用するにはDiscordアカウントでログインしてください。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            action={async () => {
              "use server";
              await signIn("discord", { redirectTo: "/dashboard" });
            }}
          >
            <Button
              type="submit"
              className="w-full bg-[#5865F2] hover:bg-[#4752C4] text-white"
            >
              <FaDiscord className="w-5 h-5 mr-3" />
              Discordでログイン
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2 pb-6">
          <p className="text-xs text-muted-foreground w-full">
            当サービスの
            <a
              href="/legal/terms"
              className="mx-1 underline underline-offset-4 hover:text-primary transition-colors"
            >
              利用規約
            </a>
            および
            <a
              href="/legal/privacy-policy"
              className="mx-1 underline underline-offset-4 hover:text-primary transition-colors"
            >
              プライバシーポリシー
            </a>
            に同意してログインします。
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
