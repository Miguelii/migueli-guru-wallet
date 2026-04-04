import 'server-only'

import {
    CreateSbClientError,
    GET_ASSETS_CACHE_KEY,
    GET_DATA_REVALIDATE_TIME,
    SbQueryError,
} from '@/lib/constants.server'
import { Logger } from '@/lib/logger'
import { createSbServerClient } from '@/lib/utils.server'
import { SbTables } from '@/types/SbTables'
import { type TickerData } from '@/types/Transaction'
import { unstable_cache } from 'next/cache'
import type { SbClient } from '@/types/SbClient'
import { Effect } from 'effect'

/**
 * Creates a cached function that fetches all ticker data from the database.
 *
 * @param supabaseClient
 * @param userId - For cache key
 */
const getAssetsFn = (supabaseClient: SbClient, userId: string) =>
    unstable_cache(
        async () => {
            const { data, error } = await supabaseClient
                .from(SbTables.DATA)
                .select('*')
                .order('ticker')

            if (error) throw error

            return data as TickerData[]
        },
        [GET_ASSETS_CACHE_KEY, userId],
        {
            revalidate: GET_DATA_REVALIDATE_TIME,
            tags: [GET_ASSETS_CACHE_KEY],
        }
    )

/**
 * Fetches all assets
 *
 * @returns A promise resolving to the list of assets
 */
export async function getAssets(): Promise<TickerData[]> {
    const program = Effect.gen(function* () {
        const supabase = yield* Effect.tryPromise({
            try: () => createSbServerClient(),
            catch: (cause) => new CreateSbClientError({ cause }),
        })

        const session = yield* Effect.promise(() => supabase.auth.getClaims())
        const user = session?.data?.claims

        if (!user) return []

        const data = yield* Effect.tryPromise({
            try: () => getAssetsFn(supabase, user.session_id)(),
            catch: (cause) => new SbQueryError({ cause }),
        })

        return data ?? []
    }).pipe(
        Effect.catchAll((error) => {
            Logger.error(`[getAssets Effect] [${error?._tag}] failed`, error)
            return Effect.succeed([] as TickerData[])
        })
    )

    return Effect.runPromise(program)
}
