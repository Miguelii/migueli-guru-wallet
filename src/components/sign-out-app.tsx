'use client'

import { useTransition } from 'react'
import { Loader2Icon, LogOutIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { signOutAction } from '@/services/sign-out-action'

export function SignOutApp() {
    const [isPending, startTransition] = useTransition()

    const router = useRouter()

    function onClick() {
        startTransition(async () => {
            await signOutAction()
            router.refresh()
        })
    }

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={onClick}
            disabled={isPending}
            className="h-9 w-full cursor-pointer px-2.5 flex flex-row gap-1.5 ring-1 ring-foreground/10 bg-background"
        >
            {isPending ? (
                <Loader2Icon className="size-4 animate-spin" />
            ) : (
                <LogOutIcon className="size-4" />
            )}
            <span>Sign Out</span>
        </Button>
    )
}
