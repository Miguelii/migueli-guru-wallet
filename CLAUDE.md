# Personal Wallet

Personal crypto and stock portfolio tracker. Replaces an Excel-based workflow with automatic DCA calculations, P&L tracking, and portfolio analytics.

## Stack

- **Framework**: Next.js 16.1.6, React 19.2.3, TypeScript
- **Database**: Supabase (PostgreSQL) via `@supabase/ssr`
- **Auth**: Supabase Auth (email/password) with server actions
- **Env Validation**: `@t3-oss/env-nextjs` with zod schemas
- **Styling**: Tailwind CSS 4 with `@theme inline` tokens (OKLch color space)
- **Components**: shadcn/ui (New York style) + Lucide icons
- **Forms**: react-hook-form + zod validation
- **URL State**: nuqs for type-safe URL search params
- **Charts**: recharts (via shadcn chart wrapper)
- **Notifications**: sonner
- **Error Handling**: Effect (`effect`) for typed, composable error handling with retry logic
- **Toolchain**: vite-plus (unified lint, fmt, test via `vp` CLI)
- **Linting**: oxlint (via vite-plus) — replaces ESLint
- **Formatting**: oxfmt (via vite-plus) — replaces Prettier
- **Testing**: Vitest (via vite-plus) + @testing-library/react + jsdom
- **Bot Protection**: Vercel BotId (`botid`)
- **React Compiler**: enabled for automatic optimization
- **Package manager**: pnpm (never npm or yarn)

## Path Alias

`@/*` maps to `./src/*`

## Project Structure

```
src/
  app/
    page.tsx              # Auth/login page (public)
    not-found.tsx         # 404 page
    layout.tsx            # Root layout
    api/
      updateTickers/
        route.ts          # POST endpoint to update ticker prices
    portfolio/
      page.tsx            # Dashboard (protected, Server Component)
      layout.tsx          # Portfolio layout with header
  components/
    ui/                   # shadcn/ui primitives (auto-generated, do not edit)
    auth-card.tsx         # Login form (client component)
    summary-cards.tsx     # Portfolio summary by asset type
    transactions-card.tsx # Transaction table
    holdings-card.tsx     # Holdings display with P&L
    allocation-chart.tsx  # Pie chart component
    allocation-card-with-chart.tsx  # Allocation wrapper
    current-prices-badges.tsx       # Current price badges
    header.tsx            # Navigation header
  services/
    get-crypto-assets.ts  # Fetch transactions from Supabase (cached)
    get-assets.ts           # Fetch ticker/price data from Supabase (cached)
    sb-login-action.ts    # Server action for authentication
    sign-out-action.ts        # Server action for sign out
    update-tickers-prices.ts  # Fetch & update current prices (Coinbase + Yahoo Finance)
  lib/
    calculations.ts       # Pure calculation functions (DCA, P&L, holdings aggregation)
    formaters.ts          # Currency/date/percentage formatters (Intl API)
    constants.ts          # Enums, route constants, ticker sets
    utils.ts              # Client utilities (cn, etc.)
    utils.server.ts       # Supabase server client, proxy, static path check
    set-csp.ts            # Content Security Policy headers
    logger.ts             # Logging utility
  types/
    Transaction.ts        # Transaction, Ticker, TickerData types
    Holding.ts            # HoldingSummary type
    SbTables.ts           # Supabase table name enum
  env/
    server.ts             # Server env validation (NEXT_SUPABASE_*)
    client.ts             # Client env validation (NEXT_PUBLIC_*)
    load-system-envs.ts   # Env loading
  styles/
    globals.css           # Global CSS with @theme inline tokens
    theme-typographic.css # Typography tokens
  proxy.ts                # Next.js middleware (CSP + Supabase auth proxy)
instrumentation-client.ts # BotId client-side initialization
scripts/
  convert-to-webp.ts      # Converts all non-WebP images in public/assets to WebP
  generate-keys.ts        # Generates private API keys
```

## Supabase Integration

### Tables
- `data` — ticker metadata and current prices (`TickerData`)
- `transactions` — buy/sell/reward/fee transactions (`Transaction`)

### Auth Flow
1. Login page (`/`) with email/password form
2. `sbLoginAction` server action validates with zod, calls `supabase.auth.signInWithPassword`
3. `proxy.ts` middleware runs `sbProxy` on every non-static request
4. `sbProxy` calls `supabase.auth.getClaims()` to refresh sessions
5. Unauthenticated users accessing `/portfolio` are redirected to `/`

### Server Client
- `createSbServerClient(useSecretKey?, hooks?)` in `lib/utils.server.ts` creates a per-request Supabase client using `@supabase/ssr` with cookie-based session management
- `useSecretKey` (default `false`): when `true`, uses the service role key to bypass RLS — use only for server-to-server operations (cron jobs, webhooks) with no user session
- Accepts optional `hooks` parameter with `onGetAll` and `onSetAll` callbacks that run **after** the default cookie handlers (used by `sbProxy` to sync cookies onto middleware request/response)
- Always create a new client per request (required for Fluid compute)

### Automatic Price Updates
- **API endpoint**: `POST /api/updateTickers` — fetches current prices from Coinbase (crypto) and Yahoo Finance (stocks/ETFs), updates `data` table
- **Auth**: `x-api-key` header (timing-safe comparison) or authenticated Supabase user session
- **Bot protection**: `checkBotId()` blocks automated requests in production
- **Supabase cron**: `invoke_update_tickers()` SQL function calls the endpoint every 4 hours via `pg_net`
- **Secrets**: API key and endpoint URL stored in Supabase Vault (`update_tickers_api_key`, `update_tickers_url`)

### Data Fetching
- Services use `server-only` import guard
- `unstable_cache` from Next.js with 4h revalidation and tagged cache keys
- Effect for error handling — all services use `Effect.gen` + `Effect.tryPromise` with `Effect.catchAll` for recovery
- Data flows as props from Server Components (no client-side state management)

### Environment Variables
```
NEXT_SUPABASE_URL               # Supabase project URL
NEXT_SUPABASE_PUBLISHABLE_KEY   # Supabase publishable key
NEXT_SUPABASE_ANON_KEY          # Supabase anon key
NEXT_SUPABASE_SERVICE_ROLE_KEY  # Supabase service role key (bypasses RLS)
NEXT_COINBASE_SECRET_KEY        # Coinbase API key for crypto prices
NEXT_UPDATE_TICKERS_SECRET_KEY  # API key for /api/updateTickers endpoint
NEXT_PUBLIC_VERCEL_URL          # Vercel deployment URL (auto-set)
```

## Supported Assets

- **Crypto**: ETH, SOL, BTC
- **ETF**: VUAA
- **Stocks**: ATCH

Transaction types: `BUY`, `SELL`, `REWARD`, `FEE`

## Conventions

### React 19
- Use `use()` instead of `useContext()` to consume context
- No `forwardRef` — use ref as a regular prop
- Server Components by default; add `"use client"` only when state, effects, or browser APIs are needed

### Data Architecture
- All data fetched from Supabase via server-only services
- Pure functions for all calculations — no side effects
- DCA uses weighted average cost method (not FIFO/LIFO)
- Multi-currency support (EUR/USD per asset)
- Formatters use `Intl.NumberFormat` and `Intl.DateTimeFormat` (pt-PT locale), not date-fns

### URL State (nuqs)
- `NuqsAdapter` wraps the app in `layout.tsx` with `shallow: false` (triggers server re-renders on param changes)
- Parsers defined in `src/lib/searchParams.ts` using `createSearchParamsCache` + `parseAsBoolean`
- Server Components read params via `searchParamsCache.parse(props.searchParams)`
- Client Components read/write params via `useQueryState` hook
- URL key mapping exported as `paramsUrlKeys` for shared use between server and client

### Styling
- Use Tailwind token classes (`bg-background`, `text-primary`) — never raw `var()` in className
- Theme colors defined in `src/styles/globals.css` via `@theme inline` (OKLch)
- Typography tokens in `src/styles/theme-typographic.css`
- Chart colors: `chart-1` through `chart-5`
- **Conditional classes**: Always use `cn()` with object syntax for conditional classes — never use template literals with ternaries in `className`
  ```tsx
  // ✅ Correct
  className={cn('text-xs font-medium', {
      'text-success': isPositive,
      'text-destructive': isNegative,
      'text-muted-foreground': isNeutral,
  })}

  // ❌ Wrong — never do this
  className={`text-xs font-medium ${isPositive ? 'text-success' : 'text-destructive'}`}
  ```

### Security
- CSP headers set via `set-csp.ts` in middleware
- HSTS, X-Frame-Options, Referrer-Policy configured
- Static file prefixes: `/_next`, `/api/`, `/assets`, `/favicon`, `/robots.txt`, `/script`
- **Bot Protection**: Vercel BotId via `botid` package

### Bot Protection (Vercel BotId)
- **Client-side**: `instrumentation-client.ts` calls `initBotId()` with protected routes
- **Server-side**: `checkBotId()` from `botid/server` in API route handlers
- **Config**: `withBotId()` wraps `next.config.ts` for proxy rewrites
- Protected routes: `/api/updateTickers` (POST), `/portfolio` (*), `/` (*)
- In development, BotId always returns `isBot: false` — only active in production on Vercel
- Deep Analysis enabled via Vercel Dashboard → Firewall → Rules

### Code Quality
- No barrel exports (index.ts re-exports)
- Import directly from the specific file
- Always use the `@/*` path alias for imports — never use relative paths like `'./label'` or `'../utils'`
- `server-only` import guard on all service files
- All exported functions must have JSDoc with `@param` tags
- All images in `public/assets/` must be WebP format — run `pnpm convert:webp` to convert

### Effect (Error Handling & Retry)
- All services use `Effect.gen` generators instead of `try/catch` or custom `tryCatch` wrappers
- `Effect.tryPromise` wraps any promise that can fail (Supabase queries, external API calls)
- `Effect.promise` wraps promises that are not expected to fail (e.g., `supabase.auth.getClaims()`)
- `Effect.catchAll` at the pipeline end for logging + safe fallback (return `[]`, `void`, or error status)
- `Effect.fail` for explicit typed failures within the pipeline (e.g., validation errors in `sbLoginAction`) — **never use `throw` inside `Effect.gen`** (creates defects that bypass `catchAll`)
- `Effect.runPromise` converts the Effect pipeline back to a `Promise` at the service boundary
- **Retry logic**: `update-tickers-prices.ts` uses `Schedule.exponential('2 second')` with `Schedule.jittered` and `Schedule.intersect(Schedule.recurs(2))` for exponential backoff with jitter on external API calls (Coinbase, Yahoo Finance) — approximate delays: ~2s → ~4s, max 2 retries
- **Concurrency**: `Effect.forEach` with `{ concurrency: 'unbounded' }` for parallel ticker updates
- **Pattern**: always `Effect.gen(function* () { ... }).pipe(Effect.catchAll(...))` — generators for composition, pipe for error recovery
- **Schedule combinators**: use `Schedule.intersect` (not `Schedule.compose`) to combine exponential backoff with retry limits; always add `Schedule.jittered` to prevent thundering herd

#### Effect Documentation
- **LLM-optimized docs**: `https://effect.website/llms-full.txt` — fetch via `WebFetch` when writing or reviewing Effect code
- **Skill**: `.claude/skills/effect-ts/SKILL.md` — project-specific patterns and rules

## Code Quality Tools

### Scripts
```
pnpm lint          # oxlint (via vp lint)
pnpm fmt           # oxfmt (via vp fmt)
pnpm typecheck     # TypeScript (tsc --noEmit)
pnpm check         # lint + typecheck + tests combined
pnpm knip          # Dead code / unused exports detection
pnpm test          # Vitest (single run, via vp test run)
pnpm test:watch    # Vitest (watch mode, via vp test)
pnpm test:coverage # Vitest with coverage
pnpm convert:webp  # Convert all non-WebP images in public/assets to WebP
```

### vite-plus (unified toolchain)
- Config: `vite.config.ts` — single file for lint, fmt, test
- CLI: `vp lint`, `vp fmt`, `vp test` (wraps oxlint, oxfmt, vitest)
- Replaces: ESLint, Prettier, separate vitest config

### oxlint
- Plugins: `typescript`, `react`, `react-perf`, `nextjs`, `import`, `unicorn`
- Categories: `correctness` (error), `suspicious` (warn), `pedantic` (warn), `perf` (warn), `style` (off)
- Ignored paths: `.next`, `out`, `build`, `node_modules`, `src/components/ui`, `scripts`, test dirs
- Rule config syntax: `'rule-name': 'off'` or `['warn', { option: value }]`

### oxfmt
- No semicolons, single quotes, 4-space indent, 100 char width, ES5 trailing commas
- Ignores: `build`, `coverage`, `CLAUDE.md`, `.agents`, `.claude`, `design-system`

### TypeScript
- Strict mode enabled, `verbatimModuleSyntax`, `isolatedModules`
- Target: ES2017, module resolution: bundler

### Vitest
- Config: `vite.config.ts` (test section)
- Environment: jsdom
- Test locations: `src/lib/__tests__/*.test.ts`, `src/hooks/__tests__/*.test.ts`
- Globals enabled (`describe`, `it`, `expect` without imports)
- Files with `server-only` import require mocking: `vi.mock('server-only', () => ({}))`

### Knip (dead code detection)
- Config: `knip.json`
- Extra entry points: `src/env/client.ts`, `src/env/load-system-envs.ts`
- Ignores: `src/components/ui/**` (shadcn auto-generated), `husky`, `radix-ui`
- Ignored binaries: `tsx`
- Tags: `-lintignore` (skips `@lintignore` tagged exports)

### Husky (pre-commit hook)
Runs on every commit:
1. `pnpm fmt` — oxfmt auto-format and stage changes
2. `pnpm check` — lint + typecheck + tests
3. `pnpm knip` — dead code check


### Data Ordering
- Transactions are fetched sorted by `buy_date` ascending directly from Supabase (`.order('buy_date', { ascending: true })`) — no client-side sorting needed

## Future Plans

- Transaction CRUD UI (add/edit/delete transactions in-app)
