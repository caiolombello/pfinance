import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import { NextRequestWithAuth } from "next-auth/middleware"

export default async function middleware(req: NextRequestWithAuth) {
  // Permitir acesso à rota de SMS sem autenticação
  if (req.nextUrl.pathname === "/api/sms-expense") {
    return NextResponse.next()
  }

  const token = await getToken({ req })
  const isAuthPage = req.nextUrl.pathname.startsWith("/login")

  if (isAuthPage) {
    if (token) {
      return NextResponse.redirect(new URL("/", req.url))
    }
    return null
  }

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url))
  }
}

export const config = {
  matcher: [
    "/",
    "/despesas",
    "/cartoes",
    "/relatorios",
    "/metas",
    "/api/:path*",
    "/((?!api/sms-expense).*)",
  ]
} 