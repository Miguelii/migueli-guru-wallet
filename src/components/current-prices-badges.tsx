import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import type { TickerData } from '@/types/Transaction'
import { formatCurrency } from '@/lib/formaters'
import { getBuildId, getLatestUpdate } from '@/lib/utils'
import { PUBLIC_ASSET_BUCKET_PATH } from '@/lib/constants.server'

type Props = {
    data: TickerData[]
}

const buildId = getBuildId()

export function CurrentPricesBadges({ data }: Props) {
    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 overflow-x-auto w-full h-full">
                {data.map((td) => (
                    <Badge
                        key={td.ticker}
                        variant="secondary"
                        className="flex items-center gap-1.5 shrink-0 px-2.5 py-2 h-10 cursor-pointer hover:bg-accent transition-colors"
                    >
                        <Image
                            src={`${PUBLIC_ASSET_BUCKET_PATH}/${td.logo}?v=${buildId}`}
                            alt={td.ticker}
                            width={16}
                            height={16}
                            className="rounded-full"
                            unoptimized
                        />
                        <span className="font-semibold text-xs">{td.ticker}</span>
                        <span className="text-xs text-muted-foreground">
                            {formatCurrency(td.curr_price, td.currency)}
                        </span>
                    </Badge>
                ))}
            </div>
            <span className="text-xs text-muted-foreground">
                Last Update: {getLatestUpdate(data)}
            </span>
        </div>
    )
}
