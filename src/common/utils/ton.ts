import { Address } from '@ton/core'

export const toFriendlyAddress = (rawAddress: string | null | undefined): string => {
  if (!rawAddress) return 'N/A'
  try {
    const parsed = Address.parse(rawAddress)
    return parsed.toString({ bounceable: false })
  } catch {
    return rawAddress
  }
}
