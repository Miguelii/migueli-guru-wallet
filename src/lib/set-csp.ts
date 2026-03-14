import type { NextResponse } from 'next/server'
import { isPathFromStaticFiles } from '@/lib/utils'
import { NEXT_IMAGE_PATH } from '@/lib/constants'

export const setCSP = (response: NextResponse, pathname: string) => {
    const csp = generateCSP()
    const staticCsp = generateStaticCSP()

    if (isPathFromStaticFiles(pathname)) {
        response.headers.set('Content-Security-Policy', staticCsp)

        if (pathname.startsWith(NEXT_IMAGE_PATH)) {
            response.headers.set('Cache-Control', 'public, max-age=31536000, must-revalidate')
        } else {
            response.headers.set('Cache-Control', 'public, max-age=31536000, immutable')
        }
    } else {
        response.headers.set('Content-Security-Policy', csp)
        response.headers.set('Cache-Control', 'public, max-age=0, must-revalidate')
    }

    response.headers.set('X-Frame-Options', 'DENY')
    response.headers.set('Referrer-Policy', 'no-referrer')
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('X-Ua-Compatible', 'IE=edge')
    response.headers.set(
        'Strict-Transport-Security',
        'max-age=31536000; includeSubDomains; preload'
    )
    response.headers.set('X-Xss-Protection', '1; mode=block')

    return response
}

const generateCSP = () => {
    //const nonce = Buffer.from(crypto.randomUUID()).toString('base64')
    const csp = `
        default-src 'self';
        style-src 'self' 
            'unsafe-inline'
            https://accounts.google.com;
        script-src 'self' 
            https://www.recaptcha.net
            https://www.google.com
            https://www.gstatic.com
            https://*.googletagmanager.com 
            https://*.google-analytics.com
            https://accounts.google.com
            https://www.googletagmanager.com
            https://*.vercel-scripts.com
            https://core.sanity-cdn.com
            'unsafe-inline' 'unsafe-eval';
        img-src 'self' 
            https://avatar.vercel.sh
            https://www.google.pt
            blob: data: 
            https://*.googletagmanager.com
            https://avatars.githubusercontent.com;
        font-src 'self'
            https://fonts.gstatic.com;
        frame-src 'self' 
            https://www.recaptcha.net
            https://www.google.com
            https://accounts.google.com;
        object-src 'none';
        media-src 'self';
        base-uri 'self';
        connect-src 'self' 
            https://*.vercel-scripts.com
            https://*.adtrafficquality.google
            https://www.googletagmanager.com
            https://*.analytics.google.com
            https://*.google-analytics.com
            https://stats.g.doubleclick.net
            blob:
            https://*.googletagmanager.com
            https://accounts.google.com
            https://*.api.sanity.io
            https://sanity-cdn.com
            wss://*.api.sanity.io;
        form-action 'self';
        frame-ancestors 'self'
            https://*.vercel-scripts.com;
    `

    return csp.replaceAll(/\s{2,}/g, ' ').trim()
}

const generateStaticCSP = () => {
    const csp = `
        default-src 'self';
        block-all-mixed-content;
        upgrade-insecure-requests;
    `
    return csp.replaceAll(/\s{2,}/g, ' ').trim()
}
