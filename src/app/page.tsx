'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Shield, Lock, CheckCircle2, Loader2, LockIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'

type ConnectionState = 'idle' | 'connecting' | 'securing' | 'success'

const STATUS_CONFIG: Record<
    Exclude<ConnectionState, 'idle'>,
    { icon: typeof Loader2; text: string }
> = {
    connecting: { icon: Loader2, text: 'Establishing connection...' },
    securing: { icon: Shield, text: 'Securing your session...' },
    success: { icon: CheckCircle2, text: 'Connection established!' },
}

function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

export default function AuthPage() {
    const [state, setState] = useState<ConnectionState>('idle')

    const router = useRouter()

    async function handleLogin() {
        setState('connecting')
        await sleep(1500)
        setState('securing')
        await sleep(1200)
        setState('success')
        await sleep(800)
        router.push('/portfolio')
    }

    return (
        <main className="flex min-h-svh items-center justify-center p-4">
            {/* Background glow effects */}
            <div className="pointer-events-none fixed inset-0 overflow-hidden">
                <div className="absolute -top-40 -left-40 h-80 w-80 rounded-full bg-chart-1/10 blur-3xl" />
                <div className="absolute -right-40 -bottom-40 h-80 w-80 rounded-full bg-chart-3/10 blur-3xl" />
            </div>

            <div className="relative z-10 flex w-full max-w-sm flex-col items-center gap-8">
                {/* Logo + Branding */}
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

                {/* Login Card */}
                <Card className="w-full shadow-lg">
                    <CardContent className="flex flex-col gap-4">
                        {/* Email placeholder */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium text-foreground">Email</label>
                            <div className="h-10 rounded-lg border border-input bg-muted/50" />
                        </div>

                        {/* Password placeholder */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium text-foreground">Password</label>
                            <div className="h-10 rounded-lg border border-input bg-muted/50" />
                        </div>

                        {/* Login Button */}
                        <Button
                            size="lg"
                            className="mt-2 h-11 w-full cursor-pointer text-sm font-semibold"
                            disabled={state !== 'idle'}
                            onClick={handleLogin}
                        >
                            {state === 'idle' ? (
                                <>
                                    <Lock className="h-4 w-4" />
                                    Establish Secure Connection
                                </>
                            ) : (
                                <ConnectionStatus state={state} />
                            )}
                        </Button>
                    </CardContent>
                </Card>

                {/* Security badge */}
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Shield className="h-3.5 w-3.5" />
                    <span>Your financial data is protected.</span>
                </div>
            </div>
        </main>
    )
}

function ConnectionStatus({ state }: { state: Exclude<ConnectionState, 'idle'> }) {
    const { icon: Icon, text } = STATUS_CONFIG[state]
    const isSuccess = state === 'success'

    return (
        <span className="flex items-center gap-2">
            <Icon
                className={`h-4 w-4 ${isSuccess ? 'text-success-foreground animate-in fade-in zoom-in duration-300' : 'animate-spin'}`}
            />
            <span className="animate-in fade-in slide-in-from-bottom-1 duration-300">{text}</span>
        </span>
    )
}
