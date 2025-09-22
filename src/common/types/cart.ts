export interface CartData {
  page_id: string
  title: string
  user_id: string
  nfts: string[]
  created_time: string
  last_edited_time: string
}

export interface FindCartByUserIdResult {
  page_id: string | null
  found: boolean
  cart?: CartData
}

export interface AddToCartRequest {
  nft_address: string
}

export interface RemoveFromCartRequest {
  nft_address: string
}

export interface DeleteCartRequest {
  user_id: string
}
