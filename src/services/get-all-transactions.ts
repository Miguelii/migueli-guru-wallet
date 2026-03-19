import 'server-only'

import { type Transaction } from '@/types/Transaction'
import {
    CreateSbClientError,
    GET_ALL_TRANSACTIONS_CACHE_KEY,
    GET_ALL_TRANSACTIONS_REVALIDATE_TIME,
    SbQueryError,
} from '@/lib/constants.server'
import { Logger } from '@/lib/logger'
import { createSbServerClient } from '@/lib/utils.server'
import { SbTables } from '@/types/SbTables'
import { unstable_cache } from 'next/cache'
import type { SbClient } from '@/types/SbClient'
import { Effect } from 'effect'

/**
 * Creates a cached function that fetches all transactions from the database.
 *
 * @param supabase - The Supabase client
 * @param userId - The authenticated user's session ID (used as cache key segment)
 */
const getAllTransactionsFn = (supabase: SbClient, userId: string) =>
    unstable_cache(
        async () => {
            const { data, error } = await supabase
                .from(SbTables.TRANSACTIONS)
                .select('*')
                .order('buy_date', { ascending: false })

            if (error) throw error

            return data as Transaction[]
        },
        [GET_ALL_TRANSACTIONS_CACHE_KEY, userId],
        {
            revalidate: GET_ALL_TRANSACTIONS_REVALIDATE_TIME,
            tags: [GET_ALL_TRANSACTIONS_CACHE_KEY],
        }
    )

/**
 * Fetches all asset transactions for the authenticated user.
 *
 * @returns A promise resolving to the list of transactions
 */
export async function getAllTransactions(): Promise<Transaction[]> {
    const program = Effect.gen(function* () {
        const supabase = yield* Effect.tryPromise({
            try: () => createSbServerClient(),
            catch: (cause) => new CreateSbClientError({ cause }),
        })

        const session = yield* Effect.promise(() => supabase.auth.getClaims())
        const user = session?.data?.claims

        if (!user) return []

        const data = yield* Effect.tryPromise({
            try: () => getAllTransactionsFn(supabase, user.session_id)(),
            catch: (cause) => new SbQueryError({ cause }),
        })

        return data ?? []
    }).pipe(
        Effect.catchAll((error) => {
            Logger.error(`[getAllTransactions Effect] [${error?._tag}] failed`, error)
            return Effect.succeed([] as Transaction[])
        })
    )

    return Effect.runPromise(program)
}
