import type { GetServerSideProps } from 'next'
import Head from 'next/head'

import { Footer } from '~/components/footer'
import { Header } from '~/components/header'
import { getUser } from '~/repositories/users'
import type { User } from '~/repositories/users/type'
import { logger } from '~/utils/log'

type Props = {
  status: 'ok'
  user: User
}

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const [user, error] = await getUser()

  if (error) {
    logger.warn('未認証のためログインページへリダイレクト')
    return {
      redirect: { destination: 'https://example.com', permanent: false },
    }
  }

  return { props: { status: 'ok', user } }
}

export default function Page(props: Props) {
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
              <a href="/debug/error?status=ok">/debug/error?status=ok</a>
            </li>
            <li>
              <a href="/debug/error?status=error">/debug/error?status=error</a>
            </li>
            <li>
              <a href="/debug/error?status=exception">
                /debug/error?status=exception
              </a>
            </li>
          </ul>
        </main>
        <Footer />
      </>
    </>
  )
}
