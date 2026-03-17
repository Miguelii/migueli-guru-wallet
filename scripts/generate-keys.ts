import { randomBytes } from 'node:crypto'

const apiKey = randomBytes(32).toString('base64url')

console.log('Your private KEY:\n')
console.log(`NEXT_UPDATE_TICKERS_SECRET_KEY=${apiKey}`)
