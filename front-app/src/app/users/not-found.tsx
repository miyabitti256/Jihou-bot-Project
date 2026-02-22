import Link from "next/link";
import { FaArrowLeft, FaUser } from "react-icons/fa";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="p-4 md:p-8 flex flex-col items-center justify-center min-h-[60vh]">
      <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-6">
        <FaUser className="w-12 h-12 text-muted-foreground" />
      </div>
      <h1 className="text-2xl md:text-3xl font-bold mb-2">
        ユーザーが見つかりませんでした
      </h1>
      <p className="text-muted-foreground mb-6 text-center max-w-md">
        指定されたIDのユーザーは存在しないか、アクセスできない可能性があります。
      </p>
      <Link href="/users">
        <Button variant="outline" className="flex items-center gap-2">
          <FaArrowLeft className="w-4 h-4" />
          ユーザー一覧に戻る
        </Button>
      </Link>
    </div>
  );
}
