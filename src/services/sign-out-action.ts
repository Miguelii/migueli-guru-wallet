'use server'

import { HOME_PAGE_PATH } from '@/lib/constants'
import { Logger } from '@/lib/logger'
import { createSbServerClient } from '@/lib/utils.server'
import { revalidatePath } from 'next/cache'
import { Effect } from 'effect'
import { CreateSbClientError, SignOutError } from '@/lib/constants.server'

/**
 * Server action that signs out the current user
 *
 * @returns {void}
 */
export async function signOutAction() {
    const program = Effect.gen(function* () {
        const supabase = yield* Effect.tryPromise({
            try: () => createSbServerClient(),
            catch: (cause) => new CreateSbClientError({ cause }),
        })

        const { error } = yield* Effect.tryPromise({
            try: () => supabase.auth.signOut(),
            catch: (cause) => new SignOutError({ cause }),
        })

        if (error)
            return yield* Effect.fail(new SignOutError({ cause: error, message: error?.message }))

        revalidatePath(HOME_PAGE_PATH, 'layout')
    }).pipe(
        Effect.catchAll((error) => {
            const errorTag = '_tag' in error ? error._tag : 'Error'
            Logger.error(`[signOutAction Effect] [${errorTag}] failed`, error)
            return Effect.void
        })
    )

    await Effect.runPromise(program)
}
