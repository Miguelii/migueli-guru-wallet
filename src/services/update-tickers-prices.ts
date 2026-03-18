import 'server-only'

import { ServerEnv } from '@/env/server'
import { Logger } from '@/lib/logger'
import { createSbServerClient } from '@/lib/utils.server'
import { SbTables } from '@/types/SbTables'
import type { TickerData } from '@/types/Transaction'
import YahooFinance from 'yahoo-finance2'
import type { CoinbaseJson } from '@/types/CoinbaseJson'
import type { SbClient } from '@/types/SbClient'
import { Effect, Schedule } from 'effect'
import {
    CreateSbClientError,
    GetCoinbasePriceError,
    GetFinancePriceError,
    SbQueryError,
} from '@/lib/constants.server'

type Return = {
    success: boolean
    status: number
}

/**
 * Retry policy with exponential backoff starting at 2 seconds, jittered (80%-120%),
 * limited to 2 retries. Approximate delays: ~2s → ~4s (total max wait: ~6s before giving up).
 * Jitter prevents thundering herd when multiple tickers retry concurrently.
 */
const retryPolicy = Schedule.exponential('2 second').pipe(
    Schedule.jittered,
    Schedule.intersect(Schedule.recurs(2))
)

/** Map of service names to their respective price fetcher functions. */
const priceFetchers: Record<
    TickerData['service'],
    (tick: TickerData) => Effect.Effect<number | null, Error>
> = {
    coinbase: getCoinbasePrice,
    yahoo: getFinancePrice,
}

/**
 * Updates all ticker prices by fetching from external APIs and saving to the database.
 * Creates a Supabase client with service role key, fetches all tickers from the database,
 * and updates each one concurrently using Effect's `forEach` with unbounded concurrency.
 * Uses Effect for retry logic on external API calls with exponential backoff.
 * @returns A promise resolving to `{ success, status }` — always resolves, never rejects
 */
export async function updateTickersPrices(): Promise<Return> {
    const program = Effect.gen(function* () {
        const supabase = yield* Effect.tryPromise({
            try: () => createSbServerClient(true),
            catch: (cause) => new CreateSbClientError({ cause }),
        })

        const { data: tickerRows } = yield* Effect.tryPromise({
            try: () => supabase.from(SbTables.DATA).select('*'),
            catch: (cause) => new SbQueryError({ cause }),
        })

        const tickers = ((tickerRows ?? []) as TickerData[]).filter(
            (t) => t.service in priceFetchers
        )

        yield* Effect.forEach(tickers, (t) => updateTicker(supabase, t), {
            concurrency: 'unbounded',
        })

        return {
            success: true,
            status: 200,
        } satisfies Return
    }).pipe(
        Effect.catchAll((error) => {
            Logger.error(`[updateTickersPrices Effect] [${error?._tag}] failed`, error)
            return Effect.succeed({
                success: false,
                status: 207,
            } satisfies Return)
        })
    )

    return Effect.runPromise(program)
}

/**
 * Fetches the current sell price from the Coinbase API for a given ticker.
 * Calls the `/v2/prices/{TICKER}-{CURRENCY}/sell` endpoint with Bearer auth.
 * @param tick - The ticker data containing the ticker symbol and currency
 * @returns An Effect that resolves to the price as a number, or `null` if unavailable
 */
function getCoinbasePrice(tick: TickerData): Effect.Effect<number | null, Error> {
    return Effect.tryPromise({
        try: async () => {
            const res = await fetch(
                `https://api.coinbase.com/v2/prices/${tick.ticker.toUpperCase()}-${tick.currency.toUpperCase()}/sell`,
                {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${ServerEnv.NEXT_COINBASE_SECRET_KEY}`,
                    },
                }
            )

            if (!res.ok) throw new Error(`Fetch Failed status=${res.status} tick=${tick.ticker}`)

            const json: CoinbaseJson = await res.json()

            return json?.data?.amount ? Number(json.data.amount) : null
        },
        catch: (cause) => new GetCoinbasePriceError({ cause }),
    })
}

/**
 * Fetches the current ask price from Yahoo Finance for a given ticker.
 * Uses the `yahoo-finance2` library to get a real-time quote.
 * @param tick - The ticker data containing the ticker symbol
 * @returns An Effect that resolves to the price as a number, or fails with an Error
 */
function getFinancePrice(tick: TickerData): Effect.Effect<number | null, Error> {
    return Effect.tryPromise({
        try: async () => {
            const yahooFinance = new YahooFinance({ suppressNotices: ['yahooSurvey'] })
            const tickerToSearch = tick.ticker.toUpperCase()
            const quote = await yahooFinance.quote(tickerToSearch)

            if (quote.ask == null)
                throw new Error(`Fetch Failed quote ask is null tick=${tick.ticker}`)

            return Number(quote.ask)
        },
        catch: (cause) => new GetFinancePriceError({ cause }),
    })
}

/**
 * Fetches the price for a ticker with retry logic and exponential backoff.
 * Selects the appropriate fetcher based on `tick.service`, applies the {@link retryPolicy},
 * and returns `null` on failure after all retries are exhausted.
 * @param tick - The ticker data to fetch the price for
 * @returns An Effect that always succeeds with a price number or `null`
 */
function fetchPrice(tick: TickerData): Effect.Effect<number | null> {
    const fetcher = priceFetchers[tick.service]
    if (!fetcher) return Effect.succeed(null)

    return fetcher(tick).pipe(
        Effect.retry(retryPolicy),
        Effect.catchAll((error) => {
            Logger.error(`[fetchPrice Effect] fetch failed after retries`, error)
            return Effect.succeed(null)
        })
    )
}

/**
 * Updates a single ticker's current price in the Supabase `data` table.
 * Fetches the latest price via {@link fetchPrice}, then writes it to the database.
 * Silently logs and recovers from any errors — never fails the overall pipeline.
 * @param supabase - The Supabase client (service role)
 * @param tick - The ticker data to update
 * @returns An Effect that always succeeds with `void`
 */
function updateTicker(supabase: SbClient, tick: TickerData): Effect.Effect<void> {
    return Effect.gen(function* () {
        const price = yield* fetchPrice(tick)
        if (!price) return

        const { error } = yield* Effect.tryPromise({
            try: () =>
                supabase
                    .from(SbTables.DATA)
                    .update({ curr_price: price, last_updated_at: 'now()' })
                    .eq('ticker', tick.ticker),
            catch: (cause) => new SbQueryError({ cause }),
        })

        if (error)
            return yield* Effect.fail(new SbQueryError({ cause: error, message: error?.message }))
    }).pipe(
        Effect.catchAll((error) => {
            const errorTag = '_tag' in error ? error._tag : 'Error'
            Logger.error(`[updateTicker Effect] [${errorTag}] failed for [${tick.ticker}]`, error)
            return Effect.void
        })
    )
}
