import { getGuildUsers } from "@/lib/api/users";
import { auth } from "@/lib/auth";
import { LoadMoreUsers } from "./load-more-users";

const PAGE_SIZE = 30;

export async function UserList() {
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
