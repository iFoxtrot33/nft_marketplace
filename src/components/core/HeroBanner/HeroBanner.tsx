'use client'

import { ThreeBanner } from '../3Dbanner'

import { LogOut } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

import { useLogOut } from '@/common'

export const HeroBanner = () => {
  const t = useTranslations('authPage')
  const pathname = usePathname()
  const { logOut, isLoading } = useLogOut()

  const isHomePage = pathname === '/'

  return (
    <div className="relative">
      <div
        className="bg-purple-light h-[120px] rounded-lg"
        style={{ boxShadow: '0 4px 8.3px 0 color-mix(in srgb, var(--color-purple-light) 51%, transparent)' }}
      >
        <div className="py-3 px-3 w-full h-full">
          <div>
            <div className="bg-mountain-dew-3 h-[24px] py-1 px-2 rounded-lg flex items-center gap-1 w-fit">
              <Image src="/logo.svg" alt="logo" width={16} height={16} />
              <p className="text-black opacity-60 text-12 font-bold">{t('banner.companyName')}</p>
            </div>

            <div className=" text-white text-2xl font-bold leading-8 font-inter mt-2">
              <p>{t('banner.nft')}</p>
              <p>{t('banner.marketplace')}</p>
            </div>
          </div>
        </div>
      </div>
      {!isHomePage && (
        <div className="absolute top-0 right-[-32px] h-full ">
          <ThreeBanner width={180} height={130} />
        </div>
      )}

      {isHomePage && (
        <div className="absolute top-0 right-0 h-full w-[24px] bg-[var(--color-mountain-dew-3)] hover:bg-[var(--color-mountain-dew-4)] transition-colors rounded-lg flex items-center justify-center">
          <button
            onClick={() => logOut()}
            disabled={isLoading}
            className="disabled:opacity-50 flex items-center justify-center"
          >
            <LogOut size={20} className="text-black" />
          </button>
        </div>
      )}
    </div>
  )
}
