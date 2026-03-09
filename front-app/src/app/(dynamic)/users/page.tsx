import Link from "next/link";
import { notFound } from "next/navigation";
import { FaUser } from "react-icons/fa";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
    <div className="flex flex-col h-full">
      <div className="grow p-4 md:p-8 space-y-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
          ユーザー一覧
        </h1>

        <UsersSearchForm initialSearch={search ?? ""} />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {users.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-16 text-center bg-white dark:bg-[#2B2D31] rounded-2xl border border-gray-200 dark:border-white/5">
              <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-[#1E1F22] flex items-center justify-center mb-4">
                <FaUser className="text-gray-400 text-2xl" />
              </div>
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-200">
                ユーザーが見つかりませんでした
              </p>
              <p className="text-sm text-gray-500 dark:text-[#949BA4] mt-1">
                検索条件を変更してお試しください
              </p>
            </div>
          ) : (
            users.map((user) => (
              <Link
                href={`/users/${user.id}`}
                key={user.id}
                className="block h-full group"
              >
                <div className="flex flex-col items-center bg-white dark:bg-[#2B2D31] rounded-2xl overflow-hidden shadow-sm border border-gray-200 dark:border-white/5 transition-all duration-200 group-hover:shadow-md group-hover:border-[#5865F2]/50 group-hover:-translate-y-1 dark:group-hover:bg-[#1E1F22] h-full relative">
                  {/* Banner */}
                  <div className="w-full h-16 bg-linear-to-r from-[#5865F2]/20 to-[#4752C4]/20 dark:from-[#1E1F22] dark:to-[#2B2D31]" />

                  <div className="px-4 pb-6 pt-0 flex flex-col items-center relative -mt-10 w-full">
                    <Avatar className="h-20 w-20 border-4 border-white dark:border-[#2B2D31] shadow-sm mb-3 group-hover:dark:border-[#1E1F22] transition-colors bg-white dark:bg-[#313338]">
                      <AvatarImage src={user.avatarUrl || ""} />
                      <AvatarFallback className="bg-gray-100 dark:bg-[#313338] text-gray-400">
                        <FaUser className="h-8 w-8" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="font-bold text-lg text-gray-900 dark:text-gray-100 truncate w-full text-center">
                      {user.username}
                    </div>
                    <div className="text-xs font-semibold text-gray-600 dark:text-[#DBDEE1] mt-2 bg-gray-100 dark:bg-[#1E1F22] px-3 py-1.5 rounded-full border border-gray-200 dark:border-white/5 group-hover:dark:bg-[#2B2D31] transition-colors shadow-inner flex items-center gap-1">
                      <span className="text-gray-400 dark:text-[#949BA4]">
                        所持金
                      </span>
                      <span>{user.money.toLocaleString()}円</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>

      <div className="sticky bottom-0 left-0 right-0 bg-white/80 dark:bg-[#313338]/80 backdrop-blur-md border-t border-gray-200 dark:border-white/5 z-10 py-4 md:pb-8 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)] dark:shadow-none">
        <UsersPagination
          totalPages={totalPages}
          currentPage={pageNumber}
          searchQuery={search}
        />
      </div>
    </div>
  );
}
