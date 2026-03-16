import { Ticker, type TickerData } from '@/types/Transaction'

const data: TickerData[] = [
    {
        ticker: Ticker.ETH,
        curr_price: 2555.135,
        last_updated_at: '2025-10-13 16:30:57',
        currency: 'EUR',
        service: 'coinbase',
        symbol: '€',
    },
    {
        ticker: Ticker.SOL,
        curr_price: 145.67,
        last_updated_at: '2025-10-13 16:30:57',
        currency: 'EUR',
        service: 'coinbase',
        symbol: '€',
    },
    /* {
        ticker: Ticker.ATCH,
        curr_price: 0.18,
        last_updated_at: '2025-10-13 16:30:57',
        currency: 'EUR',
        service: 'coinbase',
        symbol: '€',
    }, */
    {
        ticker: Ticker.BTC,
        curr_price: 90000.67,
        last_updated_at: '2025-10-13 16:30:57',
        currency: 'EUR',
        service: 'coinbase',
        symbol: '€',
    },
]

export function getData() {
    return data
}
