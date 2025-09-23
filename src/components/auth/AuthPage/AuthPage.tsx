import { HeroBanner, Login, NFTAnimation } from '@/components'

export const AuthPage = () => {
  return (
    <div className="focus:outline-none" style={{ outline: 'none' }}>
      <HeroBanner />
      <Login />
      <NFTAnimation />
    </div>
  )
}
