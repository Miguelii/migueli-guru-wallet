import { createSearchParamsCache, parseAsBoolean, type UrlKeys } from 'nuqs/server'

export const paramsUrlKeys: UrlKeys<typeof paramsParsers> = {
    hide_prices: 'hide_prices',
}

const paramsParsers = {
    hide_prices: parseAsBoolean.withDefault(false),
}

export const searchParamsCache = createSearchParamsCache(paramsParsers)
