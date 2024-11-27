import { ReactNode, FC } from 'react'

interface Props {
  children: ReactNode
}

const AuthLayout: FC<Props> = ({ children }) => {
  return <>{children}</>
}

export default AuthLayout
