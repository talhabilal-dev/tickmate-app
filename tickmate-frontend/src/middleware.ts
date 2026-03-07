import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PUBLIC_AUTH_ROUTES = new Set([
    '/signin',
    '/signup',
    'verify-email',
    '/admin/signin',
    '/auth/signin',
    '/auth/signup',
])

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl
    const token = request.cookies.get('token')?.value
    const isAuthenticated = Boolean(token)

    if (pathname.startsWith('/dashboard') && !isAuthenticated) {
        return NextResponse.redirect(new URL('/signin', request.url))
    }

    if (pathname === '/admin/signin' && isAuthenticated) {
        return NextResponse.redirect(new URL('/dashboard/admin', request.url))
    }

    if (PUBLIC_AUTH_ROUTES.has(pathname) && pathname !== '/admin/signin' && isAuthenticated) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/dashboard/:path*', '/admin/signin', '/admin', '/signin', '/signup', '/auth/signin', '/auth/signup'],
}
