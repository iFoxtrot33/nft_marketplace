import { TONNFTData } from '@/common'

export interface IUseGetNFTProps {
  address: string
}

export interface IUseGetNFTReturn {
  data: TONNFTData | undefined
  isLoading: boolean
  error: Error | null
}
