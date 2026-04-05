import CryptoJS from 'crypto-js'

export function generateRemovalToken(): string {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return Array.from(array, (b) => b.toString(16).padStart(2, '0')).join('')
}

export function hashToken(token: string): string {
  return CryptoJS.SHA256(token).toString()
}
