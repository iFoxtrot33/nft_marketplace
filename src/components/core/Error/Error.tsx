import { useTranslations } from 'next-intl'

export const Error = () => {
  const t = useTranslations('common')

  return (
    <div className="bg-[var(--color-red-dark)] text-white p-4 rounded-lg text-center">{t('somethingWentWrong')}</div>
  )
}
