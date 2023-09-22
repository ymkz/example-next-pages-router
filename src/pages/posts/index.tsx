import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import Head from 'next/head'
import { Footer } from '~/components/footer'
import { Header } from '~/components/header'
import { getPosts } from '~/repositories/posts'
import { Post } from '~/repositories/posts/type'
import { getUser } from '~/repositories/users'
import { User } from '~/repositories/users/type'

export const getServerSideProps = (async (context) => {
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
  user,
  posts,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <>
      <Head>
        <title>Posts - サンプル</title>
      </Head>
      <>
        <Header user={user} />
        <main>
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
