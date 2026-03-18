import type { LucideIcon } from 'lucide-react'
import type { PropsWithChildren } from 'react'
import Image from 'next/image'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { getBuildId } from '@/lib/utils'

type IconProps = { icon: LucideIcon; imgSrc?: never }
type ImgProps = { icon?: never; imgSrc: { src: string; alt: string } }

type Props = PropsWithChildren<
    {
        /** Card title displayed in the header */
        title: string
        titleColor?: string
    } & (IconProps | ImgProps)
>

const buildId = getBuildId()

/**
 * Generic metric card with a header (title + icon/image) and composable content area.
 * Pass either `icon` (LucideIcon) or `imgSrc` ({ src, alt }) — not both.
 * @param props - Card title, icon or imgSrc, and children
 */
export function MetricCard({ title, icon: Icon, imgSrc, children, titleColor }: Props) {
    return (
        <Card className="cursor-pointer gap-0 py-0 hover:shadow-md hover:border-border/80 transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between rounded-t-xl border-b bg-muted/50 py-3!">
                <CardTitle
                    className="text-sm font-medium text-muted-foreground"
                    style={{
                        color: titleColor ?? undefined,
                    }}
                >
                    {title}
                </CardTitle>
                {Icon ? (
                    <Icon className="h-4 w-4 text-muted-foreground" />
                ) : (
                    <Image
                        src={`${imgSrc.src}?v=${buildId}`}
                        alt={imgSrc.alt}
                        width={16}
                        height={16}
                        className="rounded-full"
                        unoptimized
                    />
                )}
            </CardHeader>
            <CardContent className="space-y-2 py-4">{children}</CardContent>
        </Card>
    )
}
