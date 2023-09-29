export type Failure = {
  status: number
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any
}

export type Result<S> = [S, null] | [null, Failure]
