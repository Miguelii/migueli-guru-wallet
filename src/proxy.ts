import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { setCSP } from '@/lib/set-csp'
import { isPathFromStaticFiles, sbProxy } from './lib/utils.server'

export async function proxy(request: NextRequest) {
    const pathname = request.nextUrl.pathname
    const requestHeaders = new Headers(request.headers)

    const response = NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    })

    // Handler to add the Content Security Policy (CSP) to the response
    setCSP(response, pathname)

    if (!isPathFromStaticFiles(pathname)) {
        return await sbProxy(request)
    }

    return response
}
