"use server";

import { auth } from "@/lib/auth";

interface JWTResponse {
  status: string;
  data?: {
    token: string;
    expiresIn: number;
  };
  error?: {
    code: string;
    message: string;
    details: any;
  };
}

/**
 * NextAuthセッションからJWTトークンを取得する
 */
export async function getJWTToken(): Promise<string | null> {
  const session = await auth();
  
  if (!session || !session.user.id) {
    console.log("No valid session found");
    return null;
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: session.user.id }),
    });

    const data: JWTResponse = await response.json();

    if (data.status === "success" && data.data) {
      return data.data.token;
    } else {
      console.error("JWT token generation failed:", data.error?.message);
      return null;
    }
  } catch (error) {
    console.error("Failed to fetch JWT token:", error);
    return null;
  }
}

/**
 * Server Action用の認証ヘッダーを取得
 */
export async function getAuthHeaders(): Promise<Record<string, string>> {
  const token = await getJWTToken();
  
  if (token) {
    return {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  }

  // フォールバック: 既存のAPIキー認証（段階的移行のため）
  return {
    "X-API-Key": process.env.API_KEY as string,
    "Content-Type": "application/json",
  };
}

/**
 * 認証済みfetchのヘルパー関数
 */
export async function authenticatedFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const headers = await getAuthHeaders();
  
  return fetch(url, {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  });
} 