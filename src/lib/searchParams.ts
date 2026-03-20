import { createSearchParamsCache, parseAsBoolean } from 'nuqs/server'

export const searchParamsCache = createSearchParamsCache({
    hide_prices: parseAsBoolean.withDefault(false),
})
