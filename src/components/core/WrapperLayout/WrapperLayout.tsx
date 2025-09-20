import { IWithChildrenProps } from '@/common'

export const WrapperLayout: React.FC<IWithChildrenProps> = ({ children }) => {
  return (
    <div className="max-w-[var(--max-width-container)] mx-auto my-[var(--spacing-vertical-gap)] px-4 max-w-[var(--max-width-container)]:px-0">
      {children}
    </div>
  )
}
