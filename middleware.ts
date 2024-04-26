import { NextRequest, NextResponse } from "next/server";

export const middleware = (req: NextRequest) => {
  let isLogin = false;

  if (!isLogin) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }
};

export const config = {
  matcher: ["/", "/dashboard"],
};
