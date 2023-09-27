type AppErrorArgs = {
  message: string
  status: number
  url: string
}

export type AppErrorSerialized = {
  name: string
  message: string
  stack?: string
  http: {
    status: number
    url: string
  }
}

export class AppError extends Error {
  status: number
  url: string

  constructor(args: AppErrorArgs) {
    super(args.message)
    this.name = AppError.name
    this.status = args.status
    this.url = args.url
  }

  serialize(): AppErrorSerialized {
    return {
      name: this.name,
      message: this.message,
      stack: this.stack,
      http: {
        status: this.status,
        url: this.url,
      },
    }
  }
}
