import type { GetServerSideProps } from 'next'
import Head from 'next/head'

import { ErrorRender } from '~/components/error-render'
import { Footer } from '~/components/footer'
import { Header } from '~/components/header'
import { getPost } from '~/repositories/posts'
import type { Post } from '~/repositories/posts/type'
import { getUser } from '~/repositories/users'
import type { User } from '~/repositories/users/type'
import type { Failure } from '~/utils/error'
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
      error: Failure
    }

export const getServerSideProps: GetServerSideProps<Props, Params> = async (
  context,
) => {
  incrementAccessCount('/posts/[id]', 'GET')
  logger.info(`request incoming to ${context.resolvedUrl}`)

  const [user, userError] = await getUser()

  if (userError) {
    logger.warn('未認証のためログインページへリダイレクト')
    return {
      redirect: { destination: '/', permanent: false },
    }
  }

  const [post, postError] = await getPost(Number(context.params?.id))
  if (postError) {
    context.res.statusCode = postError.status
    return { props: { status: 'error', error: postError } }
  }

  return { props: { status: 'ok', user, post } }
}

export default function page(props: Props) {
  if (props.status === 'error') {
    return <ErrorRender {...props.error} />
  }

  return (
    <>
      <Head>
        <title>Post - タイトル</title>
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
