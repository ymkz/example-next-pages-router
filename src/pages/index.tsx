import type { GetServerSideProps } from 'next'
import Head from 'next/head'

import { ErrorRender } from '~/components/error'
import { Footer } from '~/components/footer'
import { Header } from '~/components/header'
import { getUser } from '~/repositories/users'
import type { User } from '~/repositories/users/type'
import type { AppErrorSerialized } from '~/utils/error'
import { logger } from '~/utils/log'
import { incrementAccessCount } from '~/utils/metrics'

type Props =
  | {
      status: 'ok'
      user: User
    }
  | {
      status: 'error'
      error: AppErrorSerialized
    }

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  incrementAccessCount('/', 'GET')
  logger.info('incoming request to /')

  let user: User

  try {
    user = await getUser(1)
  } catch (err) {
    logger.info('未認証のためログインページへリダイレクト')
    return {
      redirect: { destination: '/', permanent: false },
    }
  }

  return { props: { status: 'ok', user } }
}

export default function page(props: Props) {
  if (props.status === 'error') {
    return <ErrorRender {...props.error} />
  }

  return (
    <>
      <Head>
        <title>サンプル</title>
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
              <a href="/error-survey?status=ok">/error-survey?status=ok</a>
            </li>
            <li>
              <a href="/error-survey?status=error">
                /error-survey?status=error
              </a>
            </li>
          </ul>
        </main>
        <Footer />
      </>
    </>
  )
}
