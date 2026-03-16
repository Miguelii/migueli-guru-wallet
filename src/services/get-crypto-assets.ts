import { Ticker, type Transaction, TransactionType } from '@/types/Transaction'

const DATA: Transaction[] = [
    {
        id: '534aaa9c-5d37-4f32-8c0a-7cd4e4e9e5ec',
        ticker_id: Ticker.SOL,
        type: TransactionType.Buy,
        buy_date: '2025-10-13 16:30:57',
        value: 1976.29,
        quantity: 11.794,
        buy_price: 167.57,
        fee: 23.72,
    },
    {
        id: '534aaa9c-5d37-4f32-8c0a-7cd4e4e9e5ec',
        ticker_id: Ticker.BTC,
        type: TransactionType.Buy,
        buy_date: '2025-10-13 16:30:57',
        value: 50000,
        quantity: 1,
        buy_price: 50000,
        fee: 23.72,
    },
]

export function getCryptoAssets() {
    return DATA
}
