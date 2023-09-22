import type { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import Head from 'next/head'

import { Footer } from '~/components/footer'
import { Header } from '~/components/header'
import { getUser } from '~/repositories/users'
import type { User } from '~/repositories/users/type'
import { incrementAccessCount } from '~/utils/metrics'

export const getServerSideProps = (async () => {
  incrementAccessCount('/', 'GET')

  const user = await getUser(1)

  if (!user) {
    return {
      redirect: { destination: '/', permanent: false },
    }
  }

  return { props: { user } }
}) satisfies GetServerSideProps<{ user: User }>

export default function Page({
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <>
      <Head>
        <title>サンプル</title>
        <link href="/favicon.ico" rel="icon" />
      </Head>
      <>
        <Header user={user} />
        <main>
          <ul>
            <li>
              <a href="/posts">/posts</a>
            </li>
            <li>
              <a href="/posts/1">/posts/1</a>
            </li>
            <li>
              <a href="/posts/9999">/posts/9999</a>
            </li>
          </ul>
        </main>
        <Footer />
      </>
    </>
  )
}
