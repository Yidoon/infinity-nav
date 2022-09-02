import '../styles/globals.css'
import type { AppProps } from 'next/app'
import 'antd/dist/antd.css'
import GlobalContext, { state as globalState } from '@/store/global'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <GlobalContext.Provider value={globalState}>
      <Component {...pageProps} />
    </GlobalContext.Provider>
  )
}

export default MyApp
