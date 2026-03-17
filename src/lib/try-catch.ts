import { Logger } from './logger'

type Result<T, E = Error> = {
    data: T | null
    error: E | null
}

export async function tryCatch<T, E = Error>(
    fn: () => Promise<T>,
    context: string
): Promise<Result<T, E>> {
    try {
        const data = await fn()
        return { data, error: null }
    } catch (error) {
        Logger.error(`[tryCatch Error] in ${context}`, error)
        return { data: null, error: error as E }
    }
}
