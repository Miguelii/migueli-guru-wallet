export enum TransactionType {
    Buy = 'BUY',
    Sell = 'SELL',
    Reward = 'REWARD',
    Fee = 'FEE',
}

export type Transaction = {
    id: string
    ticker_id: Ticker
    type: TransactionType
    buy_date: `${number}-${number}-${number} ${number}:${number}:${number}`
    value?: number
    quantity?: number
    buy_price?: number
    fee: number
}

export enum Ticker {
    ETH = 'ETH',
    SOL = 'SOL',
    BTC = 'BTC',
    ATCH = 'ATCH',
    VUAA = 'VUAA',
}

export type TickerData = {
    ticker: Ticker
    curr_price: number
    last_updated_at: `${number}-${number}-${number} ${number}:${number}:${number}`
    service: string
    currency: 'EUR' | 'USD' | 'CAD'
    symbol: '€' | '$'
}
