import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  console.log('Middleware 执行:', req.nextUrl.pathname)

  let res = NextResponse.next({
    request: {
      headers: req.headers,
    },
  })

  // Skip middleware if environment variables are not set (e.g., during build)
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.log('Middleware: 环境变量未设置，跳过')
    return res
  }

  // Create a Supabase client configured to use cookies
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          req.cookies.set({
            name,
            value,
            ...options,
          })
          res = NextResponse.next({
            request: {
              headers: req.headers,
            },
          })
          res.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: any) {
          req.cookies.set({
            name,
            value: '',
            ...options,
          })
          res = NextResponse.next({
            request: {
              headers: req.headers,
            },
          })
          res.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  // Refresh session if expired - required for Server Components
  const { data: { session } } = await supabase.auth.getSession()
  console.log('Middleware session:', {
    hasSession: !!session,
    pathname: req.nextUrl.pathname,
    userId: session?.user?.id,
    email: session?.user?.email
  })

  const { pathname } = req.nextUrl

  // Define protected routes - 只保护真正需要登录的页面
  const protectedRoutes = ['/dashboard', '/profile', '/settings']
  const authRoutes = ['/login', '/register', '/forgot-password']

  // Check if the current path is protected
  const isProtectedRoute = protectedRoutes.some(route =>
    pathname.startsWith(route)
  )

  // Check if the current path is an auth route
  const isAuthRoute = authRoutes.some(route =>
    pathname.startsWith(route)
  )

  console.log('Middleware 路由检查:', { isProtectedRoute, isAuthRoute, hasSession: !!session })

  // If user is not authenticated and trying to access protected route
  if (isProtectedRoute && !session) {
    console.log('Middleware: 重定向到登录页面')
    const loginUrl = new URL('/login', req.url)
    loginUrl.searchParams.set('returnTo', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // If user is authenticated and trying to access auth routes, redirect to dashboard
  if (isAuthRoute && session) {
    console.log('Middleware: 已登录用户访问登录页，重定向到dashboard')
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  console.log('Middleware: 允许访问')
  return res
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}