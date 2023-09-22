import type { GetServerSideProps } from 'next'

export const getServerSideProps = (async (context) => {
  context.res.statusCode = 200
  context.res.setHeader('Content-Type', 'text/plain')
  context.res.end('OK')
  return { props: {} }
}) satisfies GetServerSideProps

export default function Page() {
  return null
}
