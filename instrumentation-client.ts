import { HOME_PAGE_PATH, PRIVATE_ROUTE_PATH, UPDATE_TICKERS_API_PATH } from '@/lib/constants'
import { initBotId } from 'botid/client/core'

// Define the paths that need bot protection.
// These are paths that are routed to by your app.
// These can be:
// - API endpoints (e.g., '/api/checkout')
// - Server actions invoked from a page (e.g., '/dashboard')
// - Dynamic routes (e.g., '/api/create/*')
initBotId({
    protect: [
        {
            path: UPDATE_TICKERS_API_PATH,
            method: 'POST',
        },
        {
            path: PRIVATE_ROUTE_PATH,
            method: 'POST',
        },
        {
            path: HOME_PAGE_PATH,
            method: 'POST',
        },
    ],
})
