import { ShieldAlert } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function UnauthorizedPage() {
  return (
    <div className="flex h-[calc(100vh-4rem)] items-center justify-center p-4">
      <Card className="mx-auto max-w-md text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <ShieldAlert className="h-12 w-12 text-destructive" />
          </div>
          <CardTitle className="text-2xl">アクセス権限がありません</CardTitle>
          <CardDescription>
            このページを表示するにはログインが必要です。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            お探しのページは、ログイン済みのユーザーのみアクセス可能です。Discordアカウントでログインして再度お試しください。
          </p>
        </CardContent>
        <CardFooter className="flex justify-center gap-4">
          <Button asChild variant="outline">
            <Link href="/">トップページに戻る</Link>
          </Button>
          <Button asChild>
            <Link href="/api/auth/signin">ログインする</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
