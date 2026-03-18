import 'server-only'

import { GET_DATA_CACHE_KEY, GET_DATA_REVALIDATE_TIME } from '@/lib/constants'
import { Logger } from '@/lib/logger'
import { createSbServerClient } from '@/lib/utils.server'
import { SbTables } from '@/types/SbTables'
import { type TickerData } from '@/types/Transaction'
import { unstable_cache } from 'next/cache'
import type { SbClient } from '@/types/SbClient'
import { Effect } from 'effect'

/**
 * Creates a cached function that fetches all ticker data from the database.
 * Uses `unstable_cache` with a 4h revalidation window and tagged cache key.
 * @param supabase - The Supabase client
 * @param userId - The authenticated user's session ID (used as cache key segment)
 */
const getDataFn = (supabase: SbClient, userId: string) =>
    unstable_cache(
        async () => {
            const { data, error } = await supabase.from(SbTables.DATA).select('*').order('ticker')

            if (error) throw error

            return data as TickerData[]
        },
        [GET_DATA_CACHE_KEY, userId],
        {
            revalidate: GET_DATA_REVALIDATE_TIME,
            tags: [GET_DATA_CACHE_KEY],
        }
    )

/**
 * Fetches all ticker metadata and current prices for the authenticated user.
 * Returns an empty array if the user is not authenticated or if an error occurs.
 * @returns A promise resolving to the list of ticker data
 */
export async function getData(): Promise<TickerData[]> {
    const program = Effect.gen(function* () {
        const supabase = yield* Effect.tryPromise({
            try: () => createSbServerClient(),
            catch: (e) => new Error(`Failed createSbServerClient: ${String(e)}`),
        })

        const session = yield* Effect.promise(() => supabase.auth.getClaims())
        const user = session?.data?.claims

        if (!user) return []

        const data = yield* Effect.tryPromise({
            try: () => getDataFn(supabase, user.session_id)(),
            catch: (e) => new Error(`Failed getDataFn: ${String(e)}`),
        })

        return data ?? []
    }).pipe(
        Effect.catchAll((error) => {
            Logger.error('[Effect] getData failed', error)
            return Effect.succeed([] as TickerData[])
        })
    )

    return Effect.runPromise(program)
}
