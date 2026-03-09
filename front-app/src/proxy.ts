import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export const proxy = auth((req) => {
  const isLoggedIn = !!req.auth;

  if (!isLoggedIn) {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  // サーバーコンポーネントから現在のパスを取得できるように
  // x-pathname ヘッダーを付与する
  const response = NextResponse.next();
  response.headers.set("x-pathname", req.nextUrl.pathname);
  return response;
});

export const config = {
  // api, 内部ファイル, 画像, トップページ, 静的ページ(about, contact, legal, login), 連携先エラーページ等を除外する
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|about|contact|legal|login|unauthorized|$).*)",
  ],
};
