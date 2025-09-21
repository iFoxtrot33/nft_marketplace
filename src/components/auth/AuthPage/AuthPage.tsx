import { AuthBanner } from '../AuthBanner'
import { Login } from '../Login'
import { NFTAnimation } from '../NFTAnimation'

export const AuthPage = () => {
  return (
    <div>
      <AuthBanner />
      <Login />
      <NFTAnimation />
    </div>
  )
}
