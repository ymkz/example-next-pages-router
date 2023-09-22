import type { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import Head from 'next/head'

import { Footer } from '~/components/footer'
import { Header } from '~/components/header'
import { getPost } from '~/repositories/posts'
import type { Post } from '~/repositories/posts/type'
import { getUser } from '~/repositories/users'
import type { User } from '~/repositories/users/type'
import { logger } from '~/utils/log'
import { incrementAccessCount } from '~/utils/metrics'

export const getServerSideProps = (async (context) => {
  incrementAccessCount('/posts/[id]', 'GET')
  logger.info(`incoming /posts/${context.params?.id}`)

  const user = await getUser(1)

  if (!user) {
    return {
      redirect: { destination: '/', permanent: false },
    }
  }

  const post = await getPost(Number(context.params?.id))

  if (!post) {
    return { notFound: true }
  }

  return { props: { user, post } }
}) satisfies GetServerSideProps<{ user: User; post: Post }, { id: string }>

export default function Page({
  post,
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <>
      <Head>
        <title>Post - サンプル</title>
      </Head>
      <>
        <Header user={user} />
        <main>
          <ul>
            <li>
              <p>Id: {post.id}</p>
              <p>Title: {post.title}</p>
              <p>Body: {post.body}</p>
              <p>UserId: {post.userId}</p>
            </li>
          </ul>
        </main>
        <Footer />
      </>
    </>
  )
}
