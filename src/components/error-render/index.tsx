import type { Failure } from '~/utils/error'

export const ErrorRender = (error: Failure) => {
  return (
    <div>
      <h1>ErrorRender</h1>
      <p>status: {error.status}</p>
      <div>error: {JSON.stringify(error.data)}</div>
    </div>
  )
}
