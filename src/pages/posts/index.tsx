import type { GetServerSideProps } from 'next'
import Head from 'next/head'

import { ErrorRender } from '~/components/error-render'
import { Footer } from '~/components/footer'
import { Header } from '~/components/header'
import { getPosts } from '~/repositories/posts'
import type { Post } from '~/repositories/posts/type'
import { getUser } from '~/repositories/users'
import type { User } from '~/repositories/users/type'
import type { Failure } from '~/utils/error'
import { logger } from '~/utils/log'

type Props =
  | {
      status: 'ok'
      user: User
      posts: Post[]
    }
  | {
      status: 'error'
      error: Failure
    }

export const getServerSideProps: GetServerSideProps<Props> = async (
  context,
) => {
  const [user, userError] = await getUser()

  if (userError) {
    logger.warn('未認証のためログインページへリダイレクト')
    return {
      redirect: { destination: 'https://example.com', permanent: false },
    }
  }

  const [posts, postsError] = await getPosts()
  if (postsError) {
    context.res.statusCode = postsError.status
    return { props: { status: 'error', error: postsError } }
  }

  return { props: { status: 'ok', user, posts } }
}

export default function Page(props: Props) {
  if (props.status === 'error') {
    return <ErrorRender {...props.error} />
  }

  return (
    <>
      <Head>
        <title>Posts - タイトル</title>
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
