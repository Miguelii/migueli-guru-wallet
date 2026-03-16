import { Shield, LockIcon } from 'lucide-react'
import { AuthCard } from '@/components/auth-card'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Login | Migueli Guru Finances',
}

export default function AuthPage() {
    return (
        <main className="flex min-h-svh items-center justify-center p-4">
            <div className="pointer-events-none fixed inset-0 overflow-hidden">
                <div className="absolute -top-40 -left-40 h-80 w-80 rounded-full bg-chart-1/10 blur-3xl" />
                <div className="absolute -right-40 -bottom-40 h-80 w-80 rounded-full bg-chart-3/10 blur-3xl" />
            </div>

            <div className="relative z-10 flex w-full max-w-sm flex-col items-center gap-8">
                <div className="flex flex-col items-center gap-3">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary shadow-lg">
                        <LockIcon className="h-7 w-7 text-primary-foreground" />
                    </div>
                    <div className="flex flex-col items-center gap-1">
                        <h1 className="text-xl font-bold tracking-tight">Migueli Guru Finances</h1>
                    </div>

                    <div className="flex justify-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-border text-xs text-muted-foreground">
                            <span>End-to-end encrypted</span>
                            <span className="text-muted-foreground/40">|</span>
                            <span>Bank-grade security</span>
                        </div>
                    </div>
                </div>

                <AuthCard />

                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Shield className="h-3.5 w-3.5" />
                    <span>Your financial data is protected.</span>
                </div>
            </div>
        </main>
    )
}
