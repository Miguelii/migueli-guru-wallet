'use client'

import { useState } from 'react'
import { EyeIcon, EyeOffIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

const HIDE_PRICES_COOKIE_NAME = 'hide_prices'
const HIDE_PRICES_COOKIE_MAX_AGE = 60 * 60 * 24 * 7

type Props = {
    defaultHide?: boolean
}

export function HidePrices({ defaultHide = false }: Props) {
    const [hide, setHide] = useState(defaultHide)

    const router = useRouter()

    function onClick() {
        setHide(!hide)
        document.cookie = `${HIDE_PRICES_COOKIE_NAME}=${!hide}; path=/; max-age=${HIDE_PRICES_COOKIE_MAX_AGE}`
        router.refresh()
    }

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={onClick}
            aria-label={hide ? 'Show Prices' : 'Hide Prices'}
            className="h-8 w-fit cursor-pointer px-2.5 flex flex-row gap-1.5 ring-1 ring-foreground/10"
        >
            {!hide ? <EyeIcon className="size-4" /> : <EyeOffIcon className="size-4" />}
        </Button>
    )
}
