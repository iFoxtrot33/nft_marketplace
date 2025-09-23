export interface IRemoveFromCartResponse {
  success: boolean
  data: {
    page_id: string
    title: string
    user_id: string
    nfts: string[]
    created_time: string
    last_edited_time: string
  }
}
