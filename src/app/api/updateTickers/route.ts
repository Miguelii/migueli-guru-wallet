import { ServerEnv } from '@/env/server'
import { GET_CRYPTO_ASSETS_CACHE_KEY, GET_DATA_CACHE_KEY } from '@/lib/constants'
import { tryCatch } from '@/lib/try-catch'
import { updateTickersPrices } from '@/services/update-tickers-prices'
import { createSbServerClient, verifyApiKey } from '@/lib/utils.server'
import { revalidatePath, revalidateTag } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

async function isAuthorized(request: NextRequest): Promise<boolean> {
    const apiKey = request.headers.get('x-api-key')

    if (apiKey) {
        return verifyApiKey(apiKey, ServerEnv.NEXT_UPDATE_TICKERS_SECRET_KEY)
    }

    const supabase = await createSbServerClient()
    const { data } = await supabase.auth.getUser()

    return !!data.user
}

export async function POST(request: NextRequest) {
    const authorized = await isAuthorized(request)

    if (!authorized) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data, error } = await tryCatch(async () => {
        return await updateTickersPrices()
    }, 'getCoinbasePriceAPI')

    if (error || data?.success === false) {
        return NextResponse.json({ status: 400 })
    }

    revalidateTag(GET_DATA_CACHE_KEY, 'max')

    revalidateTag(GET_CRYPTO_ASSETS_CACHE_KEY, 'max')

    revalidatePath('/portfolio', 'layout')

    return NextResponse.json({ status: 200 })
}
