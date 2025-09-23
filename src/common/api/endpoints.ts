export abstract class Endpoints {
  // NFT endpoints
  static getAllNFT = `${process.env.NOTION_BASE_URL}/databases/${process.env.NOTION_NFTS_TABLE_ID}/query`
  static getNFT = (id: string) => `${process.env.NOTION_BASE_URL}/pages/${id}`
  static createNFT = `${process.env.NOTION_BASE_URL}/pages`
  static updateNFT = (id: string) => `${process.env.NOTION_BASE_URL}/pages/${id}`
  static deleteNFT = (id: string) => `${process.env.NOTION_BASE_URL}/pages/${id}`

  // Cart endpoints
  static getAllCart = `${process.env.NOTION_BASE_URL}/databases/${process.env.NOTION_NFTS_CART_ID}/query`
  static createCart = `${process.env.NOTION_BASE_URL}/pages`
  static updateCart = (id: string) => `${process.env.NOTION_BASE_URL}/pages/${id}`
  static deleteCart = (id: string) => `${process.env.NOTION_BASE_URL}/pages/${id}`

  //Marketplace endpoints
  static getAllNFTPictures = `/api/nft`
  static getSingleNFT = (address: string) => `${process.env.NEXT_PUBLIC_TON_URL}/${address}`
  static addToCart = (userid: string) => `/api/cart/${userid}`
  static getCart = (userid: string) => `/api/cart/${userid}`
  static removeItemFromCart = (userid: string) => `/api/cart/${userid}`
  static deleteAllItemsInCart = (userid: string) => `/api/cart/${userid}/all`
  static deleteCartCompletely = (userid: string) => `/api/cart/${userid}/delete`
}
