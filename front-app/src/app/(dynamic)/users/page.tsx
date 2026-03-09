import Link from "next/link";
import { notFound } from "next/navigation";
import { FaUser } from "react-icons/fa";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { getGuildUsers } from "@/lib/api/users";
import { auth } from "@/lib/auth";
import UsersPagination from "./_components/users-pagination";
import UsersSearchForm from "./_components/users-search-form";

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string }>;
}) {
  const session = await auth();

  if (!session?.user) {
    return null; // Proxy will catch this
  }

  const { page, search } = await searchParams;
  const pageNumber = Number(page) || 1;
  const itemsPerPage = 12;

  const data = await getGuildUsers(session.user.id, {
    page: pageNumber.toString(),
    limit: itemsPerPage.toString(),
    ...(search ? { search } : {}),
  });

  if (!data) {
    return notFound();
  }

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
