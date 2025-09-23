export interface IDeleteAllItemsInCartResponse {
  success: boolean
  message: string
  data: {
    page_id: string
    title: string
    user_id: string
    nfts: string[]
    created_time: string
    last_edited_time: string
  }
}
