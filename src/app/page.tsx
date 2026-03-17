import { LockIcon } from 'lucide-react'
import { AuthCard } from '@/components/auth-card'
import type { Metadata } from 'next'
import Image from 'next/image'

export const dynamic = 'force-static'
export const revalidate = 86400

export const metadata: Metadata = {
    title: 'Login | Migueli Guru Finances',
}

export default async function AuthPage() {
    return (
        <main className="flex min-h-svh">
            {/* Left panel — gurus image */}
            <div className="hidden lg:flex lg:basis-1/2 relative flex-col items-center justify-center bg-muted/30 border-r border-border">
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -left-40 h-80 w-80 rounded-full bg-chart-1/10 blur-3xl" />
                    <div className="absolute -right-40 -bottom-40 h-80 w-80 rounded-full bg-chart-3/10 blur-3xl" />
                </div>

                <div className="relative z-10 flex flex-col items-center gap-8 px-12">
                    <figure className="flex flex-col items-center gap-3">
                        <Image
                            src="/assets/funny.webp"
                            width={380}
                            height={280}
                            className="w-full max-w-sm rounded-xl shadow-lg"
                            alt="Vais ser pobre para sempre"
                            unoptimized
                        />
                        <figcaption className="text-xs text-muted-foreground italic">
                            Guru&apos;s financial motivation
                        </figcaption>
                    </figure>
                </div>
            </div>

            {/* Right panel — auth form */}
            <div className="flex flex-1 items-center justify-center p-6">
                <div className="flex w-full max-w-sm flex-col items-center gap-8">
                    <div className="flex w-full flex-col items-center gap-2">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary shadow-lg">
                            <LockIcon className="h-8 w-8 text-primary-foreground" />
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight">Migueli Finances</h1>
                        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-4 py-2 text-xs text-muted-foreground">
                            <span>End-to-end encrypted</span>
                            <span className="text-muted-foreground/40">|</span>
                            <span>Bank-grade security</span>
                        </div>
                    </div>

                    <AuthCard />
                </div>
            </div>
        </main>
    )
}
