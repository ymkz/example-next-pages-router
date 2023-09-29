import type { GetServerSideProps } from 'next'
import Head from 'next/head'

import { Footer } from '~/components/footer'
import { Header } from '~/components/header'
import { getUser } from '~/repositories/users'
import type { User } from '~/repositories/users/type'
import { logger } from '~/utils/log'
import { incrementAccessCount } from '~/utils/metrics'

type Props = {
  status: 'ok'
  user: User
}

export const getServerSideProps: GetServerSideProps<Props> = async (
  context,
) => {
  incrementAccessCount('/', 'GET')
  logger.info(`request incoming to ${context.resolvedUrl}`)

  const [user, error] = await getUser()

  if (error) {
    logger.warn('未認証のためログインページへリダイレクト')
    return {
      redirect: { destination: '/', permanent: false },
    }
  }

  return { props: { status: 'ok', user } }
}

export default function page(props: Props) {
  return (
    <>
      <Head>
        <title>タイトル</title>
      </Head>
      <>
        <Header user={props.user} />
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
              <a href="/notfound">/notfound</a>
            </li>
            <li>
              <a href="/error-check?status=ok">/error-check?status=ok</a>
            </li>
            <li>
              <a href="/error-check?status=error">/error-check?status=error</a>
            </li>
            <li>
              <a href="/error-check?status=exception">
                /error-check?status=exception
              </a>
            </li>
          </ul>
        </main>
        <Footer />
      </>
    </>
  )
}
