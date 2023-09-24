import type { GetServerSidePropsContext } from 'next'

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
) => {
  const queryError = context.query.error

  if (queryError === 'true') {
    throw new Error('error test on server')
  }

  return { props: {} }
}

export default function page() {
  const handleClick = () => {
    throw new Error('error test on client')
  }

  return (
    <>
      <div>test</div>
      <button onClick={handleClick}>submit error</button>
    </>
  )
}
