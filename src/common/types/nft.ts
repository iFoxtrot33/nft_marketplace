export interface NFTData {
  page_id: string
  id: number
  title: string
  nft_address: string
  created_time: string
  last_edited_time?: string
}

export interface CreateNFTRequest {
  nft_address: string
}

export interface UpdateNFTRequest {
  title?: string
  nft_address?: string
}

export interface SearchNFTRequest {
  query?: string
  filters?: {
    id_range?: {
      min: number
      max: number
    }
  }
  page_size?: number
  start_cursor?: string
}

export interface NFTListResponse {
  data: NFTData[]
  has_more: boolean
  next_cursor: string | null
  total: number
}

export interface NFTResponse {
  data: NFTData
}

export interface NFTCreateResponse {
  success: boolean
  data: {
    page_id: string
    id: number
    title: string
    nft_address: string
  }
}

export interface NFTUpdateResponse {
  success: boolean
  data: {
    page_id: string
    id: number
    updated_fields: string[]
  }
}

export interface NFTDeleteResponse {
  success: boolean
  message: string
}

export interface FindNFTByAddressResult {
  page_id: string | null
  found: boolean
  nft?: NFTData
}

export interface TONNFTData {
  address: string
  index: number
  owner: {
    address: string
    is_scam: boolean
    is_wallet: boolean
  }
  collection: {
    address: string
    name: string
    description: string
  }
  verified: boolean
  metadata: {
    attributes: Array<{
      trait_type?: string
      value?: string
    }>
    description: string
    marketplace: string
    name: string
    image: string
  }
  previews: Array<{
    resolution: string
    url: string
  }>
  approved_by: string[]
  trust: string
}
