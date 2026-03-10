import { Suspense } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { getGuildUsers } from "@/lib/api/users";
import { auth } from "@/lib/auth";
import { LoadMoreUsers } from "./load-more-users";

const PAGE_SIZE = 30;

async function UserListContent() {
  const session = await auth();
  if (!session?.user?.id) return null;

  let initialUsers: {
    id: string;
    username: string;
    avatarUrl: string | null;
    money: number;
  }[] = [];
  let total = 0;

  try {
    const data = await getGuildUsers(session.user.id, {
      page: "1",
      limit: String(PAGE_SIZE),
    });
    if (data?.data) {
      initialUsers = data.data.users ?? [];
      total = data.data.total ?? 0;
    }
  } catch {
    // silently fail
  }

  if (initialUsers.length === 0) {
    return (
      <div className="px-4 py-3 text-sm text-gray-400 dark:text-gray-500">
        ユーザーがいません
      </div>
    );
  }

  const hasMore = PAGE_SIZE < total;

  return (
    <LoadMoreUsers
      initialUsers={initialUsers}
      initialHasMore={hasMore}
      initialTotal={total}
    />
  );
}

function UserListSkeleton() {
  return (
    <div className="space-y-[2px]">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          // biome-ignore lint/suspicious/noArrayIndexKey: skeleton
          key={i}
          className="flex items-center gap-3 px-2 py-1.5 rounded-md"
        >
          <Avatar className="w-8 h-8 shrink-0">
            <AvatarFallback className="bg-transparent">
              <Skeleton className="w-full h-full rounded-full" />
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0 flex items-center h-[22.5px] py-[3.25px]">
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      ))}
    </div>
  );
}

export async function UserList() {
  return (
    <Suspense fallback={<UserListSkeleton />}>
      <UserListContent />
    </Suspense>
  );
}
