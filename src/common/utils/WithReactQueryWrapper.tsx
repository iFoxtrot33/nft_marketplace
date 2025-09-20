import { IWithChildrenProps } from '../types'

import React from 'react'

import { Providers } from '@/components'

export const WithReactQueryWrapper: React.FC<IWithChildrenProps> = ({ children }) => {
  return <Providers>{children}</Providers>
}
