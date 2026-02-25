"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export default function NoAuthRedirect({
  redirectPath,
}: {
  redirectPath?: string;
}) {
  const router = useRouter();
  useEffect(() => {
    toast.error("ログインしてください");
    if (redirectPath) {
      router.push(redirectPath);
    } else {
      router.back();
    }
  }, [redirectPath, router]);
  return null;
}
