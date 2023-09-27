import type { GetServerSideProps } from 'next'

import { ErrorRender } from '~/components/error'
import type { AppErrorSerialized } from '~/utils/error'
import { AppError } from '~/utils/error'

type Props =
  | {
      status: 'ok'
    }
  | {
      status: 'error'
      error: AppErrorSerialized
    }

export const getServerSideProps: GetServerSideProps<Props> = async (
  context,
) => {
  try {
    if (context.query.status === 'error') {
      throw new AppError({
        message: 'error on server',
        status: 500,
        url: context.resolvedUrl,
      })
    }
    return { props: { status: 'ok' } }
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
      <div>Error Survey: {props.status}</div>
    </>
  )
}
