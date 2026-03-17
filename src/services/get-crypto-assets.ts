import 'server-only'

import { type Transaction } from '@/types/Transaction'
import { GET_CRYPTO_ASSETS_CACHE_KEY, GET_CRYPTO_ASSETS_REVALIDATE_TIME } from '@/lib/constants'
import { tryCatch } from '@/lib/try-catch'
import { createSbServerClient } from '@/lib/utils.server'
import { SbTables } from '@/types/SbTables'
import { unstable_cache } from 'next/cache'
import type { SbClient } from '@/types/SbClient'

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

export async function getCryptoAssets(): Promise<Transaction[]> {
    const supabase = await createSbServerClient()

    const session = await supabase.auth.getClaims()

    const user = session?.data?.claims

    if (!user) return []

    const { data, error } = await tryCatch(
        getCryptoAssetsFn(supabase, user.session_id),
        'getCryptoAssets'
    )

    if (error) return []

    return data ?? []
}
