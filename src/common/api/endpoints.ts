export abstract class Endpoints {
  static getAllNFT = `${process.env.NEXT_PUBLIC_NOTION_BASE_URL}/databases/${process.env.NEXT_PUBLIC_NOTION_NFTS_TABLE_ID}/query`
  static getNFT = (id: string) => `${process.env.NEXT_PUBLIC_NOTION_BASE_URL}/pages/${id}`
  static createNFT = `${process.env.NEXT_PUBLIC_NOTION_BASE_URL}/pages`
  static updateNFT = (id: string) => `${process.env.NEXT_PUBLIC_NOTION_BASE_URL}/pages/${id}`
  static deleteNFT = (id: string) => `${process.env.NEXT_PUBLIC_NOTION_BASE_URL}/pages/${id}`
}
