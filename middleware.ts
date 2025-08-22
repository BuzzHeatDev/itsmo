import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // Add security headers
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')

  // Add caching headers for static assets
  if (request.nextUrl.pathname.startsWith('/_next/') || 
      request.nextUrl.pathname.startsWith('/branding/') ||
      request.nextUrl.pathname.endsWith('.svg') ||
      request.nextUrl.pathname.endsWith('.png') ||
      request.nextUrl.pathname.endsWith('.jpg') ||
      request.nextUrl.pathname.endsWith('.jpeg')) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable')
  }

  // Add caching for HTML pages
  if (request.nextUrl.pathname === '/' || 
      request.nextUrl.pathname.startsWith('/about') ||
      request.nextUrl.pathname.startsWith('/privacy') ||
      request.nextUrl.pathname.startsWith('/contact') ||
      request.nextUrl.pathname.startsWith('/terms')) {
    response.headers.set('Cache-Control', 'public, max-age=3600, must-revalidate')
  }

  // Add compression hint
  response.headers.set('Accept-Encoding', 'gzip, deflate, br')

  return response
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
