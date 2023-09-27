import type { GetServerSideProps } from 'next'
import Head from 'next/head'

import { ErrorRender } from '~/components/error'
import { Footer } from '~/components/footer'
import { Header } from '~/components/header'
import { getPost } from '~/repositories/posts'
import type { Post } from '~/repositories/posts/type'
import { getUser } from '~/repositories/users'
import type { User } from '~/repositories/users/type'
import { AppError, type AppErrorSerialized } from '~/utils/error'
import { logger } from '~/utils/log'
import { incrementAccessCount } from '~/utils/metrics'

type Params = {
  id: string
}

type Props =
  | {
      status: 'ok'
      user: User
      post: Post
    }
  | {
      status: 'error'
      error: AppErrorSerialized
    }

export const getServerSideProps: GetServerSideProps<Props, Params> = async (
  context,
) => {
  incrementAccessCount('/posts/[id]', 'GET')
  logger.info(`incoming request to /posts/${context.params?.id}`)

  let user: User

  try {
    user = await getUser(1)
  } catch (err) {
    logger.info('未認証のためログインページへリダイレクト')
    return {
      redirect: { destination: '/', permanent: false },
    }
  }

  try {
    const post = await getPost(Number(context.params?.id))
    return { props: { status: 'ok', user, post } }
  } catch (err) {
    if (err instanceof AppError) {
      context.res.statusCode = err.status
      return { props: { status: 'error', error: err.serialize() } }
    }
    throw err // render 500.tsx
  }
}

export default function page(props: Props) {
  if (props.status === 'error') {
    return <ErrorRender {...props.error} />
  }

  return (
    <>
      <Head>
        <title>Post - サンプル</title>
      </Head>
      <>
        <Header user={props.user} />
        <main>
          <ul>
            <li>
              <p>Id: {props.post.id}</p>
              <p>Title: {props.post.title}</p>
              <p>Body: {props.post.body}</p>
              <p>UserId: {props.post.userId}</p>
            </li>
          </ul>
        </main>
        <Footer />
      </>
    </>
  )
}
