import '@/styles/globals.css'
import type { Metadata, Viewport } from 'next'
import { Geist } from 'next/font/google'
import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'

const geistSans = Geist({
    variable: '--font-sans',
    subsets: ['latin'],
    display: 'swap',
    preload: true,
    adjustFontFallback: true,
})

export const metadata: Metadata = {
    title: 'Migueli Guru Finances',
    description: 'Private app for tracking Crypto, ETF, and Stock investments',
}

export const viewport: Viewport = {
    colorScheme: 'light',
    width: 'device-width',
    initialScale: 1,
    height: 'device-height',
}

type Props = LayoutProps<'/'>

export default function RootLayout({ children }: Props) {
    return (
        <html lang="en">
            <body
                className={`${geistSans.variable} font-sans antialiased bg-background text-primary`}
            >
                <TooltipProvider>
                    <div className="flex-1">{children}</div>
                </TooltipProvider>
                <Toaster />
            </body>
        </html>
    )
}
