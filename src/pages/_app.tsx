import type { AppProps } from 'next/app'
import Head from 'next/head'

import '~/styles/global.css'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>タイトル</title>
        <link href="/favicon.ico" rel="icon" />
      </Head>
      <Component {...pageProps} />
    </>
  )
}
