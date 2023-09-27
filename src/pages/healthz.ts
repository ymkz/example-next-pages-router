import type { GetServerSideProps } from 'next'

export const getServerSideProps: GetServerSideProps = async (context) => {
  context.res.statusCode = 200
  context.res.setHeader('Content-Type', 'text/plain')
  context.res.end('OK')
  return { props: {} }
}

export default function page() {
  return null
}
