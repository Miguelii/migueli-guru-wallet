import 'server-only'

import { type Transaction } from '@/types/Transaction'
import { GET_CRYPTO_ASSETS_CACHE_KEY, GET_CRYPTO_ASSETS_REVALIDATE_TIME } from '@/lib/constants'
import { tryCatch } from '@/lib/try-catch'
import { createSbServerClient } from '@/lib/utils.server'
import { SbTables } from '@/types/SbTables'
import { unstable_cache } from 'next/cache'

const getCryptoAssetsFn = (supabase: Awaited<ReturnType<typeof createSbServerClient>>) =>
    unstable_cache(
        async () => {
            const { data, error } = await supabase.from(SbTables.TRANSACTIONS).select('*')

            if (error) throw error

            return data as Transaction[]
        },
        [GET_CRYPTO_ASSETS_CACHE_KEY],
        {
            revalidate: GET_CRYPTO_ASSETS_REVALIDATE_TIME,
            tags: [GET_CRYPTO_ASSETS_CACHE_KEY],
        }
    )

export async function getCryptoAssets(): Promise<Transaction[]> {
    const supabase = await createSbServerClient()
    const { data, error } = await tryCatch(getCryptoAssetsFn(supabase), 'getCryptoAssets')

    if (error) return []

    return data ?? []
}
