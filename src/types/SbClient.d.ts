import type { createSbServerClient } from '@/lib/utils.server'

export type SbClient = Awaited<ReturnType<typeof createSbServerClient>>
