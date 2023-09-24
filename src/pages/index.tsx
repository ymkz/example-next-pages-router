import type { GetServerSideProps } from 'next'
import Head from 'next/head'

import { Footer } from '~/components/footer'
import { Header } from '~/components/header'
import { getUser } from '~/repositories/users'
import type { User } from '~/repositories/users/type'
import { logger } from '~/utils/log'
import { incrementAccessCount } from '~/utils/metrics'

type Props = { user: User }

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  incrementAccessCount('/', 'GET')
  logger.info('incoming /')

  const user = await getUser(1)

  if (!user) {
    return {
      redirect: { destination: '/', permanent: false },
    }
  }

  return { props: { user } }
}

export default function page({ user }: Props) {
  return (
    <>
      <Head>
        <title>サンプル</title>
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
            <li>
              <a href="/test">/test</a>
            </li>
            <li>
              <a href="/test?error=true">/test?error=true</a>
            </li>
          </ul>
        </main>
        <Footer />
      </>
    </>
  )
}
