import type { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import Head from 'next/head'

import { Footer } from '~/components/footer'
import { Header } from '~/components/header'
import { getPosts } from '~/repositories/posts'
import type { Post } from '~/repositories/posts/type'
import { getUser } from '~/repositories/users'
import type { User } from '~/repositories/users/type'
import { logger } from '~/utils/log'
import { incrementAccessCount } from '~/utils/metrics'

export const getServerSideProps = (async () => {
  incrementAccessCount('/posts', 'GET')
  logger.info('incoming /posts')

  const user = await getUser(1)

  if (!user) {
    return {
      redirect: { destination: '/', permanent: false },
    }
  }

  const posts = await getPosts()

  return { props: { user, posts } }
}) satisfies GetServerSideProps<{ user: User; posts: Post[] }>

export default function Page({
  posts,
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <>
      <Head>
        <title>Posts - サンプル</title>
      </Head>
      <>
        <Header user={user} />
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
            <input name="userId" type="hidden" value={user.id} />
            <button type="submit">作成</button>
          </form>
          <ul>
            {posts.map((post) => (
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
