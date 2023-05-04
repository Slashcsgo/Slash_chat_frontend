import { sha256 } from 'crypto-hash'

export const hash = async (message: string): Promise<string> => {
  return sha256(message)
}