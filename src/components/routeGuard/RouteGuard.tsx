import { FC, ReactNode } from 'react'
import { Navigate } from 'react-router-dom'

interface Props {
  route: {
    path: string
    layout: FC<{ children: ReactNode }>
    component: FC
    public: boolean
  }
}

const RouteGuard: FC<Props> = ({ route }) => {
  if (route.public || localStorage.getItem('pano-auth')) {
    return (
      <route.layout>
        <route.component />
      </route.layout>
    )
  }

  return (
    <Navigate
      to='/dashboard/login'
      state={{
        from: route.path
      }}
      replace
    />
  )
}

export default RouteGuard
