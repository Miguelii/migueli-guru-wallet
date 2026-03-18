import { TransactionType } from '@/types/Transaction'

export const HOME_PAGE_PATH = '/' as const

export const UPDATE_TICKERS_API_PATH = '/api/updateTickers' as const

export const PRIVATE_ROUTE_PATH = '/portfolio' as const

export const TYPE_BADGE_VARIANT = {
    [TransactionType.Buy]: 'success',
    [TransactionType.Sell]: 'alert',
    [TransactionType.Reward]: 'secondary',
    [TransactionType.Fee]: 'outline',
} as const

export const TYPE_LABEL = {
    [TransactionType.Buy]: 'Buy',
    [TransactionType.Sell]: 'Sell',
    [TransactionType.Reward]: 'Reward',
    [TransactionType.Fee]: 'Fee',
} as const
