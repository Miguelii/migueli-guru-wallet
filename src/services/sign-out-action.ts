'use server'

import { HOME_PAGE_PATH } from '@/lib/constants'
import { Logger } from '@/lib/logger'
import { createSbServerClient } from '@/lib/utils.server'
import { revalidatePath } from 'next/cache'
import { Effect } from 'effect'

/**
 * Server action that signs out the current user and revalidates the home page.
 * Logs and silently recovers from any errors.
 */
export async function signOutAction() {
    const program = Effect.gen(function* () {
        const supabase = yield* Effect.tryPromise({
            try: () => createSbServerClient(),
            catch: (e) => new Error(`Failed createSbServerClient: ${String(e)}`),
        })

        const { error } = yield* Effect.tryPromise({
            try: () => supabase.auth.signOut(),
            catch: (e) => new Error(`signOut failed: ${String(e)}`),
        })

        if (error) throw error

        revalidatePath(HOME_PAGE_PATH, 'layout')
    }).pipe(
        Effect.catchAll((error) => {
            Logger.error('[Effect] signOutAction failed', error)
            return Effect.void
        })
    )

    await Effect.runPromise(program)
}
