'use server'

import { createSbServerClient } from '@/lib/utils.server'
import { z } from 'zod'

const loginSchema = z.object({
    email: z.email(),
    password: z.string().min(6),
})

type Props = z.infer<typeof loginSchema>

export async function sbLoginAction(props: Props) {
    try {
        const result = loginSchema.safeParse(props)

        if (!result.success) {
            return {
                status: 400,
                error: 'Invalid Request',
            }
        }

        const supabase = await createSbServerClient()

        const { error } = await supabase.auth.signInWithPassword({
            email: result.data.email,
            password: result.data.password,
        })

        if (error) {
            return {
                status: 500,
                error: 'Bad Request',
            }
        }

        return {
            status: 200,
        }
    } catch (err) {
        console.error(err)
        return {
            status: 500,
            error: 'Unknow Error',
        }
    }
}
