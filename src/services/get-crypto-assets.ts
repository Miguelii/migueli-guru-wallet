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
        id: '1',
        ticker_id: Ticker.ATCH,
        type: TransactionType.Buy,
        buy_date: '2025-10-13 16:30:57',
        value: 1089.21,
        quantity: 1320,
        buy_price: 0.812,
        fee: 10.72,
    },
    {
        id: '2',
        ticker_id: Ticker.ATCH,
        type: TransactionType.Buy,
        buy_date: '2025-10-13 16:30:57',
        value: 398.87,
        quantity: 518,
        buy_price: 0.766,
        fee: 2.98,
    },
    {
        id: '3',
        ticker_id: Ticker.ATCH,
        type: TransactionType.Sell,
        buy_date: '2025-10-13 16:30:57',
        value: 999.28,
        quantity: 703,
        buy_price: 1.447,
        fee: 4.51,
    },
    {
        id: '4',
        ticker_id: Ticker.ATCH,
        type: TransactionType.Fee,
        buy_date: '2025-10-13 16:30:57',
        fee: 5,
    },
]

export function getCryptoAssets() {
    return DATA
}
