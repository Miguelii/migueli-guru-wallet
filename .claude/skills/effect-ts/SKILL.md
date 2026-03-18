---
name: effect-ts
description: Effect TypeScript library best practices and patterns. Use when writing, reviewing, or refactoring code that uses the Effect library for error handling, retry logic, concurrency, or composable pipelines. Triggers on tasks involving Effect.gen, Effect.tryPromise, Schedule, or any Effect import.
license: MIT
metadata:
  author: effect
  version: "1.0.0"
---

# Effect TypeScript

Typed, composable error handling and async pipelines using the Effect library. Reference documentation fetched from the official LLM-optimized source.

## When to Apply

Reference these guidelines when:
- Writing new services or server actions that use Effect
- Adding retry logic or scheduling to async operations
- Reviewing Effect pipelines for correctness (expected errors vs defects)
- Refactoring `try/catch` or `tryCatch` patterns to Effect
- Using concurrency with `Effect.forEach` or `Effect.all`

## Documentation Source

Fetch the full Effect documentation optimized for LLMs:

```
WebFetch: https://effect.website/llms-full.txt
```

This contains the complete developer documentation including API patterns, error management, scheduling, and concurrency.

## Key Rules

### Error Handling
- **Never `throw` inside `Effect.gen`** — creates defects that bypass `catchAll`. Use `yield* Effect.fail(error)` instead
- **`Effect.tryPromise`**: always use `{ try, catch }` form for typed errors — never the simple form
- **`Effect.promise`**: only for promises that **never reject** (rejections become untyped defects)
- **`Effect.catchAll`**: catches expected errors only — defects bypass it entirely
- **`Effect.fail`**: for explicit typed failures within pipelines

### Generators
- Always `yield*` (with asterisk), never plain `yield`
- Generators short-circuit on first error — subsequent `yield*` calls are skipped
- Use `return yield* Effect.fail(...)` for conditional failures with proper type narrowing

### Scheduling & Retry
- **`Schedule.intersect`** (not `compose`) to combine exponential backoff with retry limits
- **`Schedule.jittered`**: always add to prevent thundering herd in concurrent retries
- Production pattern: `Schedule.exponential(base).pipe(Schedule.jittered, Schedule.intersect(Schedule.recurs(n)))`

### Concurrency
- `Effect.forEach` with `{ concurrency: 'unbounded' }` for parallel execution
- Default behavior short-circuits on first error — use `{ mode: 'either' }` to collect all results

### Running Effects
- **`Effect.runPromise`**: default choice for async effects at service boundaries
- **`Effect.runSync`**: only for purely synchronous effects that cannot fail
- Prefer a single runner at the boundary — compose everything else with `Effect.gen` and `pipe`

## Project Patterns

This project uses Effect in all `src/services/*.ts` files following this pattern:

```typescript
export async function myService(): Promise<ReturnType> {
    const program = Effect.gen(function* () {
        // 1. Create clients with Effect.tryPromise
        // 2. Compose async steps with yield*
        // 3. Return typed result
    }).pipe(
        Effect.catchAll((error) => {
            Logger.error('[Effect] myService failed', error)
            return Effect.succeed(fallbackValue)
        })
    )

    return Effect.runPromise(program)
}
```
