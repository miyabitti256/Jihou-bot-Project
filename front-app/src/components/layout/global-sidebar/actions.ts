"use server";

import { signIn, signOut } from "@/lib/auth";

export async function signOutAction(): Promise<string> {
  await signOut();
  return "/api/auth/signout";
}

export const signInAction = async () => {
  await signIn();
};
