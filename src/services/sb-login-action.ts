'use server'

import { Logger } from '@/lib/logger'
import { createSbServerClient } from '@/lib/utils.server'
import { z } from 'zod'
import { checkBotId } from 'botid/server'
import { Effect } from 'effect'
import { CreateSbClientError, IsBotError, SignInWithPasswordError } from '@/lib/constants.server'

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
 *
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
            catch: (cause) => new IsBotError({ cause, message: 'VERCEL_BOT_PROTECTION' }),
        })

        if (isBot) {
            return yield* Effect.fail(new Error('Not Acceptable'))
        }

        const supabase = yield* Effect.tryPromise({
            try: () => createSbServerClient(),
            catch: (cause) => new CreateSbClientError({ cause }),
        })

        const { error } = yield* Effect.tryPromise({
            try: () =>
                supabase.auth.signInWithPassword({
                    email: result.data.email,
                    password: result.data.password,
                }),
            catch: (cause) => new SignInWithPasswordError({ cause }),
        })

        if (error)
            return yield* Effect.fail(
                new SignInWithPasswordError({ cause: error, message: error?.message })
            )

        return { status: 200 } satisfies Return
    }).pipe(
        Effect.catchAll((error) => {
            const errorTag = '_tag' in error ? error._tag : 'Error'
            const isBotError = errorTag === 'IsBotError'
            Logger.error(`[sbLoginAction Effect] [${errorTag}] failed`, error)
            return Effect.succeed({
                status: isBotError ? 406 : 400,
                error: 'Bad Credentials',
            } satisfies Return)
        })
    )

    return Effect.runPromise(program)
}
