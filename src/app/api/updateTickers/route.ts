import { ServerEnv } from '@/env/server'
import {
    GET_CRYPTO_ASSETS_CACHE_KEY,
    GET_DATA_CACHE_KEY,
    PRIVATE_ROUTE_PATH,
} from '@/lib/constants'
import { tryCatch } from '@/lib/try-catch'
import { updateTickersPrices } from '@/services/update-tickers-prices'
import { createSbServerClient, verifyApiKey } from '@/lib/utils.server'
import { revalidatePath, revalidateTag } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'
import { checkBotId } from 'botid/server'

export const dynamic = 'force-dynamic'

async function isAuthorized(request: NextRequest): Promise<boolean> {
    const apiKey = request.headers.get('x-api-key')

    if (apiKey) {
        return verifyApiKey(apiKey, ServerEnv.NEXT_UPDATE_TICKERS_SECRET_KEY)
    }

    const supabase = await createSbServerClient(true)
    const { data } = await supabase.auth.getUser()

    return !!data.user
}

export async function POST(request: NextRequest) {
    const authorized = await isAuthorized(request)

    if (!authorized) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { isBot } = await checkBotId()
    if (isBot) {
        return NextResponse.json({ error: 'Not Acceptable' }, { status: 406 })
    }

    const { data, error } = await tryCatch(async () => {
        return await updateTickersPrices()
    }, 'getCoinbasePriceAPI')

    if (error || data?.success === false) {
        return NextResponse.json({ status: 400 })
    }

    revalidateTag(GET_DATA_CACHE_KEY, 'max')

    revalidateTag(GET_CRYPTO_ASSETS_CACHE_KEY, 'max')

    revalidatePath(PRIVATE_ROUTE_PATH, 'layout')

    return NextResponse.json({ status: 200 })
}
