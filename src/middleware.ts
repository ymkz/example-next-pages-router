import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import { incrementAccessCount } from '~/utils/metric'

export function middleware(request: NextRequest) {
  incrementAccessCount(request.nextUrl.pathname, request.method)

  const response = NextResponse.next()

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
