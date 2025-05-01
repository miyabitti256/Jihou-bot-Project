import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  // ダミーのカード数を定義
  const skeletonCards = Array.from({ length: 12 }, (_, i) => i);

  return (
    <div className="flex flex-col">
      <div className="flex-grow p-4 md:p-8 space-y-4 md:space-y-6">
        <h1 className="text-xl md:text-3xl font-bold">ユーザー一覧</h1>

        {/* 検索フォームのスケルトン */}
        <div className="mb-6">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Skeleton className="h-10 w-full" />
            </div>
            <Skeleton className="h-10 w-20" />
          </div>
        </div>

        {/* ユーザーカードのスケルトン */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {skeletonCards.map((index) => (
            <Card key={index} className="overflow-hidden h-full">
              <CardContent className="p-0">
                <div className="flex flex-col items-center space-y-3 p-6">
                  <Skeleton className="h-20 w-20 rounded-full" />
                  <Skeleton className="h-5 w-28" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* ページネーションのスケルトン */}
      <div className="sticky bottom-0 left-0 right-0 bg-background z-10 py-4 md:pb-8">
        <div className="flex justify-center">
          <Skeleton className="h-10 w-80" />
        </div>
      </div>
    </div>
  );
}
