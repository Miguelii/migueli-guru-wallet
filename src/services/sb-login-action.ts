'use server'

import { tryCatch } from '@/lib/try-catch'
import { createSbServerClient } from '@/lib/utils.server'
import { z } from 'zod'
import { checkBotId } from 'botid/server'

const loginSchema = z.object({
    email: z.email(),
    password: z.string().min(6),
})

type Props = z.infer<typeof loginSchema>

type Return = {
    status: number
    error?: string
}

export async function sbLoginAction(props: Props): Promise<Return> {
    const { data } = await tryCatch(async () => {
        const result = loginSchema.safeParse(props)

        if (!result.success) {
            throw new Error('Invalid Request')
        }

        const { isBot } = await checkBotId()
        if (isBot) throw new Error('BOT DETECTED!')

        const supabase = await createSbServerClient()

        const { error } = await supabase.auth.signInWithPassword({
            email: result.data.email,
            password: result.data.password,
        })

        if (error) {
            throw new Error(JSON.stringify(error))
        }

        return {
            success: true,
        }
    }, 'sbLoginAction')

    if (data?.success === true) {
        return {
            status: 200,
        }
    }

    return {
        status: 400,
        error: 'Bad Credentials',
    }
}
