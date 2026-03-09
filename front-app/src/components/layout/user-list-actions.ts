"use server";

import { getGuildUsers } from "@/lib/api/users";
import { auth } from "@/lib/auth";

export interface UserData {
  id: string;
  username: string;
  avatarUrl: string | null;
  money: number;
}

export async function fetchMoreUsers(page: number, limit = 30) {
  const session = await auth();
  if (!session?.user?.id) {
    return { users: [], total: 0, hasMore: false };
  }

  try {
    const data = await getGuildUsers(session.user.id, {
      page: String(page),
      limit: String(limit),
    });

    if (!data?.data) {
      return { users: [], total: 0, hasMore: false };
    }

    const users: UserData[] = data.data.users ?? [];
    const total: number = data.data.total ?? 0;

    return {
      users,
      total,
      hasMore: page * limit < total,
    };
  } catch {
    return { users: [], total: 0, hasMore: false };
  }
}
