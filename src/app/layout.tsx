import '@/styles/globals.css'
import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import { Toaster } from '@/components/ui/sonner'

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

type Props = LayoutProps<'/'>

export default function RootLayout({ children }: Props) {
    return (
        <html lang="en">
            <body
                className={`${geistSans.variable} font-sans antialiased bg-background text-primary`}
            >
                <div className="flex-1">{children}</div>
                <Toaster />
            </body>
        </html>
    )
}
