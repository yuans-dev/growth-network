import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { getRoleFromAccessToken } from "@/lib/auth/jwt";

const PUBLIC_PATHS = ["/", "/onboarding", "/accept-invite", "/not-authorized"];
const PROTECTED_PATH_PREFIXES = [
  "/dashboard",
  "/profile",
  "/matches",
  "/deal-board",
  "/documents",
  "/events",
  "/payments",
  "/stage-1",
  "/stage-2",
  "/stage-3",
  "/stage-4",
];
const ADMIN_PATH_PREFIXES = ["/admin"];

function isProtectedPath(pathname: string) {
  return PROTECTED_PATH_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

function isAdminPath(pathname: string) {
  return ADMIN_PATH_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (PUBLIC_PATHS.includes(pathname) || pathname.startsWith("/_next")) {
    return NextResponse.next();
  }

  const response = NextResponse.next();
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    "";

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    supabaseKey,
    {
      cookies: {
        get(name) {
          return request.cookies.get(name)?.value;
        },
        set(name, value, options) {
          response.cookies.set({ name, value, ...options });
        },
        remove(name, options) {
          response.cookies.set({ name, value: "", ...options, maxAge: 0 });
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user && isProtectedPath(pathname)) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/";
    return NextResponse.redirect(redirectUrl);
  }

  if (user && isAdminPath(pathname)) {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const role = getRoleFromAccessToken(session?.access_token);

    if (role !== "admin") {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/not-authorized";
      return NextResponse.redirect(redirectUrl);
    }
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|assets).*)"],
};
