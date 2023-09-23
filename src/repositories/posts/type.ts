export type Post = {
  userId: number
  id: number
  title: string
  body: string
}

export type CreatePostBody = {
  title: string
  body: string
  userId: number
}
