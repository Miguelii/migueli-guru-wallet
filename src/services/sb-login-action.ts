'use server'

import { Logger } from '@/lib/logger'
import { createSbServerClient } from '@/lib/utils.server'
import { z } from 'zod'
import { checkBotId } from 'botid/server'
import { Effect } from 'effect'

const loginSchema = z.object({
    email: z.email(),
    password: z.string().min(6),
})

type Props = z.infer<typeof loginSchema>

type Return = {
    status: number
    error?: string
}

/**
 * Server action that authenticates a user with email and password via Supabase Auth.
 * Validates input with zod, checks bot protection, and signs in with Supabase.
 * @param props - The login credentials (email and password)
 * @returns A promise resolving to `{ status, error? }` — `200` on success, `400` on failure
 */
export async function sbLoginAction(props: Props): Promise<Return> {
    const program = Effect.gen(function* () {
        const result = loginSchema.safeParse(props)

        if (!result.success) {
            return yield* Effect.fail(new Error('Invalid Request'))
        }

        const { isBot } = yield* Effect.tryPromise({
            try: () => checkBotId(),
            catch: (e) => new Error(`Bot check failed: ${String(e)}`),
        })

        if (isBot) {
            return yield* Effect.fail(new Error('Not Acceptable'))
        }

        const supabase = yield* Effect.tryPromise({
            try: () => createSbServerClient(),
            catch: (e) => new Error(`Failed to create Supabase client: ${String(e)}`),
        })

        const { error } = yield* Effect.tryPromise({
            try: () =>
                supabase.auth.signInWithPassword({
                    email: result.data.email,
                    password: result.data.password,
                }),
            catch: (e) => new Error(`signInWithPassword failed: ${String(e)}`),
        })

        if (error) {
            return yield* Effect.fail(new Error(JSON.stringify(error)))
        }

        return { status: 200 } satisfies Return
    }).pipe(
        Effect.catchAll((error) => {
            Logger.error('[Effect] sbLoginAction failed', error)
            return Effect.succeed({
                status: 400,
                error: 'Bad Credentials',
            } satisfies Return)
        })
    )

    return Effect.runPromise(program)
}
