import type { GetServerSideProps } from 'next'
import Head from 'next/head'

import { ErrorRender } from '~/components/error'
import { Footer } from '~/components/footer'
import { Header } from '~/components/header'
import { getPosts } from '~/repositories/posts'
import type { Post } from '~/repositories/posts/type'
import { getUser } from '~/repositories/users'
import type { User } from '~/repositories/users/type'
import type { AppErrorSerialized } from '~/utils/error'
import { AppError } from '~/utils/error'
import { logger } from '~/utils/log'
import { incrementAccessCount } from '~/utils/metrics'

type Props =
  | {
      status: 'ok'
      user: User
      posts: Post[]
    }
  | {
      status: 'error'
      error: AppErrorSerialized
    }

export const getServerSideProps: GetServerSideProps<Props> = async (
  context,
) => {
  incrementAccessCount('/posts', 'GET')
  logger.info('incoming request to /posts')

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
    const posts = await getPosts()
    return { props: { status: 'ok', user, posts } }
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
        <title>Posts - サンプル</title>
      </Head>
      <>
        <Header user={props.user} />
        <main>
          <form action="/api/create-post" method="POST">
            <div>
              <label>title: </label>
              <input name="title" type="text" />
            </div>
            <div>
              <label>body: </label>
              <input name="body" type="text" />
            </div>
            <input name="userId" type="hidden" value={props.user.id} />
            <button type="submit">作成</button>
          </form>
          <ul>
            {props.posts.map((post) => (
              <li key={post.id}>
                <p>Id: {post.id}</p>
                <p>Title: {post.title}</p>
                <p>Body: {post.body}</p>
                <p>UserId: {post.userId}</p>
              </li>
            ))}
          </ul>
        </main>
        <Footer />
      </>
    </>
  )
}
