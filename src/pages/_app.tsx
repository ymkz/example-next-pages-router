import type { AppProps } from 'next/app'
import Head from 'next/head'
import '~/styles/global.css'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>サンプル</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Component {...pageProps} />
    </>
  )
}
