import 'server-only'

import { GET_DATA_CACHE_KEY, GET_DATA_REVALIDATE_TIME } from '@/lib/constants'
import { tryCatch } from '@/lib/try-catch'
import { createSbServerClient } from '@/lib/utils.server'
import { SbTables } from '@/types/SbTables'
import { type TickerData } from '@/types/Transaction'
import { unstable_cache } from 'next/cache'
import type { SbClient } from '@/types/SbClient'

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

export async function getData(): Promise<TickerData[]> {
    const supabase = await createSbServerClient()

    const session = await supabase.auth.getClaims()

    const user = session?.data?.claims

    if (!user) return []

    const { data, error } = await tryCatch(getDataFn(supabase, user.session_id), 'getData')

    if (error) return []

    return data ?? []
}
