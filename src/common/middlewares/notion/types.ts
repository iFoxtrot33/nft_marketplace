import { Client } from '@notionhq/client'
import { NextRequest } from 'next/server'

export interface NotionRequest extends NextRequest {
  notion: Client
  notionHeaders: Record<string, string>
}
