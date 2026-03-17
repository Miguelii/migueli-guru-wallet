import 'server-only'

import { GET_DATA_CACHE_KEY } from '@/lib/constants'
import { tryCatch } from '@/lib/try-catch'
import { createSbServerClient } from '@/lib/utils.server'
import { SbTables } from '@/types/SbTables'
import { type TickerData } from '@/types/Transaction'
import { unstable_cache } from 'next/cache'

const getDataFn = (supabase: Awaited<ReturnType<typeof createSbServerClient>>) =>
    unstable_cache(
        async () => {
            const { data, error } = await supabase.from(SbTables.DATA).select('*')

            if (error) throw error

            return data as TickerData[]
        },
        [GET_DATA_CACHE_KEY],
        {
            revalidate: 60,
            tags: [GET_DATA_CACHE_KEY],
        }
    )

export async function getData(): Promise<TickerData[]> {
    const supabase = await createSbServerClient()
    const { data, error } = await tryCatch(getDataFn(supabase), 'getData')

    if (error) return []

    return data ?? []
}
