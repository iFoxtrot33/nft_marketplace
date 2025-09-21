import { ThreeBanner } from '../3Dbanner'

import Image from 'next/image'

export const AuthBanner = () => {
  return (
    <div className="relative">
      <div className="bg-purple-light h-[120px] rounded-lg ">
        <div className="py-3 px-3 w-full h-full">
          <div>
            <div className="bg-mountain-dew-3 h-[24px] py-1 px-2 rounded-lg flex items-center gap-1 w-fit">
              <Image src="/logo.svg" alt="logo" width={16} height={16} />
              <p className="text-black opacity-60 text-12 font-bold">DigiCollect</p>
            </div>
            <p className="text-white text-2xl font-bold leading-8 font-inter mt-2">NFT Marketplace</p>
          </div>
        </div>
      </div>
      <div className="absolute top-0 right-[-0px] h-full ">
        <ThreeBanner width={180} height={130} />
      </div>
    </div>
  )
}
