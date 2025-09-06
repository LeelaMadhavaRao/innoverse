import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifyToken } from "./lib/auth"

export function middleware(request: NextRequest) {
  const token = request.cookies.get("auth-token")?.value

  // Public routes that don't require authentication
  const publicRoutes = ["/", "/login", "/poster-launch", "/gallery"]
  const isPublicRoute = publicRoutes.includes(request.nextUrl.pathname)

  if (isPublicRoute) {
    return NextResponse.next()
  }

  // Check if user is authenticated
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  const decoded = verifyToken(token)
  if (!decoded) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Role-based route protection
  const pathname = request.nextUrl.pathname
  const userRole = decoded.role

  if (pathname.startsWith("/admin") && userRole !== "admin") {
    return NextResponse.redirect(new URL("/unauthorized", request.url))
  }

  if (pathname.startsWith("/evaluator") && userRole !== "evaluator") {
    return NextResponse.redirect(new URL("/unauthorized", request.url))
  }

  if (pathname.startsWith("/team") && userRole !== "team") {
    return NextResponse.redirect(new URL("/unauthorized", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
