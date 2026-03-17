import 'server-only'

import { ServerEnv } from '@/env/server'
import { Logger } from '@/lib/logger'
import { tryCatch } from '@/lib/try-catch'
import { createSbServerClient } from '@/lib/utils.server'
import { SbTables } from '@/types/SbTables'
import type { TickerData } from '@/types/Transaction'
import YahooFinance from 'yahoo-finance2'
import type { CoinbaseJson } from '@/types/CoinbaseJson'
import type { SbClient } from '@/types/SbClient'

type Return = {
    success: boolean
    status: number
}

type PriceFetcher = (tick: TickerData) => Promise<number | null>

const priceFetchers: Record<string, PriceFetcher> = {
    coinbase: getCoinbasePrice,
    yahoo: getFinancePrice,
}

export async function updateTickersPrices(): Promise<Return> {
    const supabase = await createSbServerClient(true)

    const { data: tickerRows } = await supabase.from(SbTables.DATA).select('*')

    const tickers = (tickerRows ?? []) as TickerData[]

    console.log({ tickers })

    const supported = tickers.filter((t) => t.service in priceFetchers)

    const results = await Promise.allSettled(
        supported.map((tick) => updateTickerPrice(supabase, tick))
    )

    const hasErrors = results.some((r) => r.status === 'rejected')

    return {
        success: !hasErrors,
        status: hasErrors ? 207 : 200,
    }
}

async function updateTickerPrice(supabase: SbClient, tick: TickerData): Promise<void> {
    const fetchPrice = priceFetchers[tick.service]
    if (!fetchPrice) return

    const price = await fetchPrice(tick)
    if (!price) return

    const { error } = await supabase
        .from(SbTables.DATA)
        .update({ curr_price: price, last_updated_at: 'now()' })
        .eq('ticker', tick.ticker)

    if (error) {
        Logger.error(`Error updating price for ${tick.ticker} |${JSON.stringify(error)}|`)
    }
}

async function getCoinbasePrice(tick: TickerData): Promise<number | null> {
    const { data, error } = await tryCatch(async () => {
        const res = await fetch(
            `https://api.coinbase.com/v2/prices/${tick.ticker.toUpperCase()}-${tick.currency.toUpperCase()}/buy`,
            {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${ServerEnv.NEXT_COINBASE_SECRET_KEY}`,
                },
            }
        )

        if (!res.ok) throw new Error(`Fetch Failed status=${res.status} tick=${tick.ticker}`)

        const json: CoinbaseJson = await res.json()

        console.log({ json })

        if (json?.data?.amount) {
            return Number(json?.data?.amount)
        }

        return null
    }, `getCoinbasePrice-${tick.ticker}`)

    if (error || data == null) return null

    return data
}

async function getFinancePrice(tick: TickerData): Promise<number | null> {
    const { data, error } = await tryCatch(async () => {
        const yahooFinance = new YahooFinance()

        const tickerToSearch = tick.ticker.toUpperCase()

        const quote = await yahooFinance.quote(tickerToSearch)

        console.log({ quote })

        if (quote.ask == null) throw new Error(`Fetch Failed quote as is null tick=${tick.ticker}`)

        return Number(quote?.ask)
    }, `getFinancePrice-${tick.ticker}`)

    if (error || data == null) return null

    return data
}
