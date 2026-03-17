# Migueli Guru Finances

Private app for tracking my Crypto, ETF, and Stock investments.

![alt text](/public/assets/preview.webp)

## Automatic Price Updates

Ticker prices are updated automatically every 4 hours via a Supabase cron job that calls `POST /api/updateTickers`.

- **Crypto prices**: Coinbase API
- **Stocks/ETFs**: Yahoo Finance

## Vercel BotId

Vercel BotID is an invisible CAPTCHA that protects against sophisticated bots without showing visible challenges or requiring user action.

Protects page's and api's routes (`instrumentation-client.ts`)

## Code Quality Tools

- **Prettier**: Consistent code formatting
- **ESLint**: Linting with Next.js rules
- **TypeScript**: Strict type safety
- **Vitest**: Unit testing
- **Knip**: Dead code / unused exports detection
- **Husky**: Pre-commit hooks (prettier + check + knip)
