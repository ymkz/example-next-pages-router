import type { GetServerSideProps } from 'next'

import { ErrorRender } from '~/components/error-render'
import type { Failure } from '~/utils/error'
import { logger } from '~/utils/log'

type Props =
  | {
      status: 'ok'
    }
  | {
      status: 'error'
      error: Failure
    }

export const getServerSideProps: GetServerSideProps<Props> = async (
  context,
) => {
  logger.info(`request incoming to ${context.resolvedUrl}`)

  if (context.query.status === 'error') {
    context.res.statusCode = 500
    return { props: { status: 'error', error: { status: 500 } } }
  }

  if (context.query.status === 'exception') {
    throw new Error('exception on server') // render 500.tsx
  }

  return { props: { status: 'ok' } }
}

export default function page(props: Props) {
  if (props.status === 'error') {
    return <ErrorRender {...props.error} />
  }

  return (
    <>
      <div>ErrorCheck: {props.status}</div>
    </>
  )
}
