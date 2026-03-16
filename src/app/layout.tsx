import '@/styles/globals.css'
import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import { Toaster } from '@/components/ui/sonner'
import { Header } from '@/components/header'

const geistSans = Geist({
    variable: '--font-sans',
    subsets: ['latin'],
    display: 'swap',
    preload: true,
    adjustFontFallback: true,
})

export const metadata: Metadata = {
    title: 'Migueli Guru Finances - Wallet',
    description: 'Track your crypto and stock portfolio with automatic DCA calculations',
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en">
            <body
                className={`${geistSans.variable} font-sans antialiased bg-background text-primary`}
            >
                <Header />
                <main className="flex-1 p-4 md:p-6">{children}</main>
                <Toaster />
            </body>
        </html>
    )
}
