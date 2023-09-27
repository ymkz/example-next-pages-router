import type { AppErrorSerialized } from '~/utils/error'

export const ErrorRender = ({ http, message, name }: AppErrorSerialized) => {
  return (
    <div>
      <h1>name: {name}</h1>
      <p>message: {message}</p>
      <div>
        <p>status: {http.status}</p>
        <p>url: {http.url}</p>
      </div>
    </div>
  )
}
