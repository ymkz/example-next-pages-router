import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import { timestamp } from '~/utils/log'
import { incrementAccessCount } from '~/utils/metric'

export function middleware(request: NextRequest) {
  incrementAccessCount(request.nextUrl.pathname, request.method)

  console.info(
    JSON.stringify({
      level: 'info',
      timestamp: timestamp(),
      req: { url: request.url, method: request.method },
      msg: 'request incoming',
    }),
  )

  const response = NextResponse.next()

  console.info(
    JSON.stringify({
      level: 'info',
      timestamp: timestamp(),
      res: { statusCode: response.status },
      msg: 'request completed',
    }),
  )

  return response
}

export const config = {
  matcher: ['/((?!_next|healthz|favicon.ico).*)'],
}
