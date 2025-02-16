import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createClient } from "@/utils/supabase/middleware"

export async function middleware(request: NextRequest) {
  // Verificar autenticação específica para /api/sms-expense
  if (request.nextUrl.pathname === "/api/sms-expense") {
    const apiKey = request.headers.get('x-api-key')
    if (apiKey !== process.env.SMS_API_KEY) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }
    return NextResponse.next()
  }

  const { supabase, response } = createClient(request)
  
  const { data: { session } } = await supabase.auth.getSession()

  const isAuthPage = request.nextUrl.pathname.startsWith("/login")
  const isAuthenticated = !!session

  // Rotas públicas que não precisam de autenticação
  const publicRoutes = ["/login", "/auth/callback"]
  if (publicRoutes.includes(request.nextUrl.pathname)) {
    return response
  }

  // Se não estiver autenticado e não for uma rota pública, redireciona para login
  if (!isAuthenticated) {
    const redirectUrl = new URL("/login", request.url)
    redirectUrl.searchParams.set("next", request.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // Se estiver autenticado e tentar acessar página de login, redireciona para home
  if (isAuthPage && isAuthenticated) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
} 