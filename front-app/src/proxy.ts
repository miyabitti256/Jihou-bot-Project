import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export const proxy = auth((req) => {
  const isLoggedIn = !!req.auth;
  const pathname = req.nextUrl.pathname;

  // 動的ルート（認証必須）のプレフィクスリスト
  const protectedRoutes = [
    "/channels",
    "/dashboard",
    "/minigame",
    "/schedule",
    "/users",
  ];

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );

  if (isProtectedRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  // サーバーコンポーネントから現在のパスを取得できるように
  // x-pathname ヘッダーを付与する
  const response = NextResponse.next();
  response.headers.set("x-pathname", pathname);
  return response;
});

export const config = {
  // api, 内部ファイル, 画像類をスキップして、基本すべてのアクセスを通す
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
