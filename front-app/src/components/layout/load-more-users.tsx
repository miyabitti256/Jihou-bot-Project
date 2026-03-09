"use client";

import { ChevronDown, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";
import { FaDiscord } from "react-icons/fa";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { UserData } from "./user-list-actions";
import { fetchMoreUsers } from "./user-list-actions";

interface LoadMoreUsersProps {
  initialUsers: UserData[];
  initialHasMore: boolean;
  initialTotal: number;
}

const PAGE_SIZE = 30;

export function LoadMoreUsers({
  initialUsers,
  initialHasMore,
  initialTotal,
}: LoadMoreUsersProps) {
  const [users, setUsers] = useState<UserData[]>(initialUsers);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [page, setPage] = useState(1);
  const [isPending, startTransition] = useTransition();

  const handleLoadMore = () => {
    const nextPage = page + 1;
    startTransition(async () => {
      const result = await fetchMoreUsers(nextPage, PAGE_SIZE);
      setUsers((prev) => [...prev, ...result.users]);
      setHasMore(result.hasMore);
      setPage(nextPage);
    });
  };

  return (
    <>
      <div className="space-y-[2px]">
        {users.map((user) => (
          <Link
            key={user.id}
            href={`/users/${user.id}`}
            className={cn(
              "flex items-center gap-3 px-2 py-1.5 rounded-md group transition-colors",
              "text-gray-600 hover:text-gray-900 hover:bg-gray-200/50",
              "dark:text-gray-300 dark:hover:text-gray-100 dark:hover:bg-white/10",
            )}
          >
            <Avatar className="w-8 h-8 shrink-0">
              <AvatarImage src={user.avatarUrl || ""} alt={user.username} />
              <AvatarFallback className="bg-[#5865F2] text-white text-xs">
                <FaDiscord className="w-4 h-4" />
              </AvatarFallback>
            </Avatar>
            <span className="font-medium text-[15px] truncate">
              {user.username}
            </span>
          </Link>
        ))}
      </div>

      {hasMore && (
        <button
          type="button"
          onClick={handleLoadMore}
          disabled={isPending}
          className={cn(
            "w-full mt-1 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer",
            "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50",
            "dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-white/10",
            "flex items-center justify-center gap-1.5",
            isPending && "opacity-50 cursor-wait",
          )}
        >
          {isPending ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              読み込み中...
            </>
          ) : (
            <>
              <ChevronDown className="w-3.5 h-3.5" />
              もっと見る ({users.length}/{initialTotal})
            </>
          )}
        </button>
      )}
    </>
  );
}
