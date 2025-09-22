export abstract class Endpoints {
  static getAllNFT = `${process.env.NOTION_BASE_URL}/databases/${process.env.NOTION_NFTS_TABLE_ID}/query`
  static getNFT = (id: string) => `${process.env.NOTION_BASE_URL}/pages/${id}`
  static createNFT = `${process.env.NOTION_BASE_URL}/pages`
  static updateNFT = (id: string) => `${process.env.NOTION_BASE_URL}/pages/${id}`
  static deleteNFT = (id: string) => `${process.env.NOTION_BASE_URL}/pages/${id}`

  static getAllCart = `${process.env.NOTION_BASE_URL}/databases/${process.env.NOTION_NFTS_CART_ID}/query`
  static createCart = `${process.env.NOTION_BASE_URL}/pages`
  static updateCart = (id: string) => `${process.env.NOTION_BASE_URL}/pages/${id}`
  static deleteCart = (id: string) => `${process.env.NOTION_BASE_URL}/pages/${id}`
}
