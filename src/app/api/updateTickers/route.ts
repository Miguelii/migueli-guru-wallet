import { ServerEnv } from '@/env/server'
import { PRIVATE_ROUTE_PATH } from '@/lib/constants'
import { updateTickersPrices } from '@/services/update-tickers-prices'
import { createSbServerClient, verifyApiKey } from '@/lib/utils.server'
import { revalidatePath, revalidateTag } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'
import { checkBotId } from 'botid/server'
import { GET_ALL_TRANSACTIONS_CACHE_KEY, GET_ASSETS_CACHE_KEY } from '@/lib/constants.server'

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

    const result = await updateTickersPrices()

    if (!result.success) {
        return NextResponse.json({ status: result.status })
    }

    revalidateTag(GET_ASSETS_CACHE_KEY, 'max')

    revalidateTag(GET_ALL_TRANSACTIONS_CACHE_KEY, 'max')

    revalidatePath(PRIVATE_ROUTE_PATH, 'layout')

    return NextResponse.json({ status: 200 })
}
