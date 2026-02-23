import Link from "next/link";
import { notFound } from "next/navigation";
import { FaUser } from "react-icons/fa";
import NoAuthRedirect from "@/components/noAuthRedirect";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { authenticatedFetch } from "@/lib/auth-api";
import type { UsersListResponse } from "@/types/api-response";
import UsersPagination from "./components/users-pagination";
import UsersSearchForm from "./components/users-search-form";

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string }>;
}) {
  const session = await auth();

  if (!session) {
    return <NoAuthRedirect redirectPath="/" />;
  }

  // 検索とページネーションの処理
  const { page, search } = await searchParams;
  const pageNumber = Number(page) || 1;
  const itemsPerPage = 12;

  // APIからユーザー一覧を取得
  const apiUrl = new URL(
    `${process.env.API_URL}/api/users/guilds/${session.user.id}`,
  );

  // クエリパラメータの設定
  apiUrl.searchParams.set("page", pageNumber.toString());
  apiUrl.searchParams.set("limit", itemsPerPage.toString());
  if (search) {
    apiUrl.searchParams.set("search", search);
  }

  // APIリクエスト
  const response = await authenticatedFetch(apiUrl.toString(), {
    method: "GET",
    cache: "no-store", // SSRに変更
  });

  if (!response.ok) {
    if (response.status === 404) {
      return notFound();
    }
    throw new Error("ユーザー一覧の取得に失敗しました");
  }

  const data: UsersListResponse = await response.json();
  const { users, total } = data.data;
  const totalPages = Math.ceil(total / itemsPerPage);

  return (
    <div className="flex flex-col">
      <div className="grow p-4 md:p-8 space-y-4 md:space-y-6">
        <h1 className="text-xl md:text-3xl font-bold">ユーザー一覧</h1>

        <UsersSearchForm initialSearch={search ?? ""} />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {users.length === 0 ? (
            <div className="col-span-full text-center py-8">
              ユーザーが見つかりませんでした
            </div>
          ) : (
            users.map((user) => (
              <Link href={`/users/${user.id}`} key={user.id}>
                <Card className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer h-full">
                  <CardContent className="p-0">
                    <div className="flex flex-col items-center space-y-3 p-6">
                      <Avatar className="h-20 w-20">
                        <AvatarImage src={user.avatarUrl || ""} />
                        <AvatarFallback>
                          <FaUser />
                        </AvatarFallback>
                      </Avatar>
                      <div className="font-medium text-center">
                        {user.username}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        所持金: {user.money.toLocaleString()}円
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))
          )}
        </div>
      </div>

      <div className="sticky bottom-0 left-0 right-0 bg-background z-10 py-4 md:pb-8">
        <UsersPagination
          totalPages={totalPages}
          currentPage={pageNumber}
          searchQuery={search}
        />
      </div>
    </div>
  );
}
