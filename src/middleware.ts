import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// 定义公开路由
const publicRoutes = [
  '/login',
  // 可以添加其他公开路由
]

// 定义不需要验证的系统路由
const systemRoutes = [
  '/_next',
  '/favicon.ico',
  '/static',
  '/images',
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // 检查是否是系统路由
  const isSystemRoute = systemRoutes.some(route => pathname.startsWith(route))
  if (isSystemRoute) {
    return NextResponse.next()
  }
  
  // 检查是否是公开路由
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))
  
  // 获取token
  const token = request.cookies.get('token')?.value
  
  // 如果是非公开路由且没有token，重定向到登录页
  if (!isPublicRoute && !token) {
    const loginUrl = new URL('/login', request.url)
    // 保存原始URL作为重定向参数
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }
  
  // 如果已登录用户访问登录页，重定向到首页
  if (pathname === '/login' && token) {
    return NextResponse.redirect(new URL('/', request.url))
  }
  
  return NextResponse.next()
}

// 配置需要进行中间件处理的路由
export const config = {
  matcher: [
    /*
     * 匹配所有路由，除了：
     * - _next (Next.js 系统文件)
     * - static (静态文件)
     * - images (图片文件)
     * - favicon.ico
     */
    '/((?!_next|static|images|favicon.ico).*)',
  ],
} 