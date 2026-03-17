'use server'

import { HOME_PAGE_PATH } from '@/lib/constants'
import { tryCatch } from '@/lib/try-catch'
import { createSbServerClient } from '@/lib/utils.server'
import { revalidatePath } from 'next/cache'

export async function signOutAction() {
    await tryCatch(async () => {
        const supabase = await createSbServerClient()
        const { error } = await supabase.auth.signOut()
        if (error) throw error

        revalidatePath(HOME_PAGE_PATH, 'layout')
    }, 'signOutAction')
}
