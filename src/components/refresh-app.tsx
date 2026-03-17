'use client'

import { useTransition } from 'react'
import { Loader2Icon, RefreshCwIcon } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export function RefreshApp() {
    const [isPending, startTransition] = useTransition()

    const router = useRouter()

    function onClick() {
        startTransition(async () => {
            const res = await fetch('/api/updateTickers', {
                method: 'POST',
                credentials: 'include',
                cache: 'no-cache',
            })

            if (res.ok) {
                toast.success('Preços atualizados com sucesso!')
                router.refresh()
            } else {
                toast.error('Ocorreu um erro ao atualizar os preços.')
            }
        })
    }

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={onClick}
            disabled={isPending}
            className="h-12 w-fit cursor-pointer px-2.5 flex flex-row gap-1.5 border ring-1 ring-foreground/10"
        >
            {isPending ? (
                <Loader2Icon className="size-4 animate-spin" />
            ) : (
                <RefreshCwIcon className="size-4" />
            )}
            <span className="">Update prices</span>
        </Button>
    )
}
