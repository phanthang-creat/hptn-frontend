import { Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faChessPawn,
  faChessKnight,
  faChessBishop,
  faChessRook,
  faChessQueen,
  faChessKing,
  faChess
} from '@fortawesome/free-solid-svg-icons'
import { routes, antdTheme } from '~/configs'
import { SuspenseFallback, RouteGuard } from '~/components'
import { firebaseAnalyticsConfiguration } from './configs/firebaseAnalytics'
import { metaTagsConfigurations } from './configs/metaTags'

const App = () => {
  library.add(faChessPawn, faChessKnight, faChessBishop, faChessRook, faChessQueen, faChessKing, faChess)
  firebaseAnalyticsConfiguration()
  metaTagsConfigurations()

  return (
    <Suspense fallback={<SuspenseFallback />}>
      <ConfigProvider theme={antdTheme}>
        <Router>
          <Routes>
            {routes.map((route) => (
              <Route key={route.path} path={route.path} element={<RouteGuard route={route} />} />
            ))}
            <Route path='*' element={<Navigate to='/' replace />} />
          </Routes>
        </Router>
      </ConfigProvider>
    </Suspense>
  )
}

export default App
