# Personal Wallet

Personal crypto and stock portfolio tracker. Replaces an Excel-based workflow with automatic DCA calculations, P&L tracking, and portfolio analytics.

## Stack

- **Framework**: Next.js 16.1.6, React 19.2.3, TypeScript
- **Styling**: Tailwind CSS 4 with `@theme inline` tokens
- **Components**: shadcn/ui (New York style) + Lucide icons
- **Forms**: react-hook-form + zod validation
- **Charts**: recharts (via shadcn chart wrapper)
- **Dates**: date-fns
- **Notifications**: sonner
- **React Compiler**: enabled for automatic optimization
- **Package manager**: pnpm (never npm or yarn)

## Path Alias

`@/*` maps to `./src/*`

## Project Structure

```
src/
  app/              # Next.js pages (App Router)
  components/
    ui/             # shadcn/ui primitives (auto-generated, do not edit)
    layout/         # App shell, sidebar, header
    dashboard/      # Dashboard page components
    transactions/   # Transaction CRUD components
    assets/         # Asset detail components
  lib/
    types.ts        # All TypeScript interfaces
    constants.ts    # Enums, defaults
    calculations.ts # Pure calculation functions (DCA, P&L)
    format.ts       # Currency/date/percentage formatters
    storage.ts      # localStorage abstraction (future: Supabase)
    hooks/          # Custom hooks
  providers/        # React context providers
  styles/           # Global CSS, theme tokens
```

## Conventions

### React 19
- Use `use()` instead of `useContext()` to consume context
- No `forwardRef` — use ref as a regular prop
- Server Components by default; add `"use client"` only when state, effects, or browser APIs are needed

### State Management
- Context providers follow the `{ state, actions, meta }` pattern (composition pattern)
- Derived state is computed inline during render, NEVER in useEffect
- localStorage sync uses lazy state initialization in useState

### Styling
- Use Tailwind token classes (`bg-background`, `text-primary`) — never raw `var()` in className
- Theme colors defined in `src/styles/theme-colors.css` via `@theme inline`
- Typography tokens in `src/styles/theme-typographic.css`

### Code Quality
- No barrel exports (index.ts re-exports)
- Import directly from the specific file
- Pure functions for all calculations — no side effects
- Try-catch around all localStorage operations

### Data Architecture
- All data persisted to localStorage via `src/lib/storage.ts` abstraction
- Storage key is versioned (`portfolio:v1`) for migration support
- Multi-currency support (EUR/USD per asset)
- DCA uses weighted average cost method (not FIFO/LIFO)
- Designed so swapping to Supabase later only changes `storage.ts`

## Skills

Follow these skills for all development:

- **ui-ux-pro-max**: Run `python3 .claude/skills/ui-ux-pro-max/scripts/search.py` for design decisions
- **vercel-react-best-practices**: 62 rules in `.agents/skills/vercel-react-best-practices/rules/`
- **vercel-composition-patterns**: Composition rules in `.agents/skills/vercel-composition-patterns/rules/`
- **web-design-guidelines**: Web design principles in `.agents/skills/web-design-guidelines/`

## Future Plans

- Supabase database integration (replace localStorage)
- GitHub OAuth authentication
- Real-time price API integration
