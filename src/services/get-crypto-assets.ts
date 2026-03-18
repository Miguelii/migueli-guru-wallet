import 'server-only'

import { type Transaction } from '@/types/Transaction'
import { GET_CRYPTO_ASSETS_CACHE_KEY, GET_CRYPTO_ASSETS_REVALIDATE_TIME } from '@/lib/constants'
import { Logger } from '@/lib/logger'
import { createSbServerClient } from '@/lib/utils.server'
import { SbTables } from '@/types/SbTables'
import { unstable_cache } from 'next/cache'
import type { SbClient } from '@/types/SbClient'
import { Effect } from 'effect'

/**
 * Creates a cached function that fetches all transactions from the database.
 * Uses `unstable_cache` with a 4h revalidation window and tagged cache key.
 * @param supabase - The Supabase client
 * @param userId - The authenticated user's session ID (used as cache key segment)
 */
const getCryptoAssetsFn = (supabase: SbClient, userId: string) =>
    unstable_cache(
        async () => {
            const { data, error } = await supabase
                .from(SbTables.TRANSACTIONS)
                .select('*')
                .order('buy_date', { ascending: false })

            if (error) throw error

            return data as Transaction[]
        },
        [GET_CRYPTO_ASSETS_CACHE_KEY, userId],
        {
            revalidate: GET_CRYPTO_ASSETS_REVALIDATE_TIME,
            tags: [GET_CRYPTO_ASSETS_CACHE_KEY],
        }
    )

/**
 * Fetches all crypto asset transactions for the authenticated user.
 * Returns an empty array if the user is not authenticated or if an error occurs.
 * @returns A promise resolving to the list of transactions
 */
export async function getCryptoAssets(): Promise<Transaction[]> {
    const program = Effect.gen(function* () {
        const supabase = yield* Effect.tryPromise({
            try: () => createSbServerClient(),
            catch: (e) => new Error(`Failed createSbServerClient: ${String(e)}`),
        })

        const session = yield* Effect.promise(() => supabase.auth.getClaims())
        const user = session?.data?.claims

        if (!user) return []

        const data = yield* Effect.tryPromise({
            try: () => getCryptoAssetsFn(supabase, user.session_id)(),
            catch: (e) => new Error(`Failed getCryptoAssetsFn: ${String(e)}`),
        })

        return data ?? []
    }).pipe(
        Effect.catchAll((error) => {
            Logger.error('[Effect] getCryptoAssets failed', error)
            return Effect.succeed([] as Transaction[])
        })
    )

    return Effect.runPromise(program)
}
