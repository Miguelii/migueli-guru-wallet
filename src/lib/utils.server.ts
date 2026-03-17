import 'server-only'

import { createServerClient } from '@supabase/ssr'
import type { GetAllCookies, SetAllCookies } from '@supabase/ssr/dist/main/types'
import { cookies } from 'next/headers'
import { ServerEnv } from '@/env/server'
import { NextRequest, NextResponse } from 'next/server'
import { PRIVATE_ROUTE_PAGE, STATIC_PREFIXES } from '@/lib/constants'
import { timingSafeEqual } from 'node:crypto'

/**
 * Checks whether a given pathname corresponds to a static file
 * (e.g. `/_next`, `/api/`, `/assets`, `/favicon`).
 * @param pathname - The request pathname to check.
 */
export const isPathFromStaticFiles = (pathname: string): boolean => {
    return STATIC_PREFIXES.some((prefix) => pathname.startsWith(prefix))
}

/**
 * Creates a Supabase server client with cookie-based session management.
 * Uses `next/headers` cookies by default. Pass optional `hooks` to run
 * additional logic after the default `getAll`/`setAll` handlers
 * (e.g. syncing cookies onto a middleware request/response).
 *
 * Always create a new client per request (required for Fluid compute).
 * @param hooks - Optional callbacks that run after the default cookie handlers.
 * @param hooks.onGetAll - Runs after reading all cookies from the cookie store.
 * @param hooks.onSetAll - Runs after writing cookies to the cookie store, receives the cookies that were set.
 */
export async function createSbServerClient(
    useSecretKey?: boolean,
    hooks?: {
        onGetAll?: GetAllCookies
        onSetAll?: SetAllCookies
    }
) {
    const cookieStore = await cookies()

    return createServerClient(
        ServerEnv.NEXT_SUPABASE_URL,
        useSecretKey
            ? ServerEnv.NEXT_SUPABASE_SERVICE_ROLE_KEY
            : ServerEnv.NEXT_SUPABASE_PUBLISHABLE_KEY,
        {
            cookies: {
                getAll() {
                    const result = cookieStore.getAll()
                    hooks?.onGetAll?.()
                    return result
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        )
                        hooks?.onSetAll?.(cookiesToSet)
                    } catch {
                        // The `setAll` method was called from a Server Component.
                        // This can be ignored if you have middleware refreshing
                        // user sessions.
                    }
                },
            },
        }
    )
}

/**
 * Supabase auth proxy for Next.js middleware.
 * Refreshes the user session via `getClaims()` and syncs auth cookies
 * between the incoming request and outgoing response.
 * Redirects unauthenticated users away from protected routes.
 * @param request - The incoming Next.js middleware request.
 */
export async function sbProxy(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    // With Fluid compute, don't put this client in a global environment
    // variable. Always create a new one on each request.
    const supabase = await createSbServerClient(false, {
        onSetAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
            supabaseResponse = NextResponse.next({
                request,
            })
            cookiesToSet.forEach(({ name, value, options }) =>
                supabaseResponse.cookies.set(name, value, options)
            )
        },
    })

    // Do not run code between createServerClient and
    // supabase.auth.getClaims(). A simple mistake could make it very hard to debug
    // issues with users being randomly logged out.
    // IMPORTANT: If you remove getClaims() and you use server-side rendering
    // with the Supabase client, your users may be randomly logged out.
    const { data } = await supabase.auth.getClaims()

    const user = data?.claims

    if (!user && request.nextUrl.pathname.startsWith(PRIVATE_ROUTE_PAGE)) {
        const url = request.nextUrl.clone()
        url.pathname = '/'
        return NextResponse.redirect(url)
    }

    // IMPORTANT: You *must* return the supabaseResponse object as it is. If you're
    // creating a new response object with NextResponse.next() make sure to:
    // 1. Pass the request in it, like so:
    //    const myNewResponse = NextResponse.next({ request })
    // 2. Copy over the cookies, like so:
    //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
    // 3. Change the myNewResponse object to fit your needs, but avoid changing
    //    the cookies!
    // 4. Finally:
    //    return myNewResponse
    // If this is not done, you may be causing the browser and server to go out
    // of sync and terminate the user's session prematurely!
    return supabaseResponse
}

/**
 * Compares an API key against an expected value using a timing-safe comparison
 * to prevent timing attacks.
 * @param apiKey - The API key to verify.
 * @param expected - The expected API key value.
 */
export function verifyApiKey(apiKey: string, expected: string): boolean {
    if (apiKey.length !== expected.length) return false

    return timingSafeEqual(Buffer.from(apiKey), Buffer.from(expected))
}
