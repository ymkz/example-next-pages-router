import type { CreatePostBody, Post } from '~/repositories/posts/type'

export const getPostsStub = async (): Promise<Post[]> => {
  return [
    {
      userId: 1,
      id: 1,
      title: 'stub_title',
      body: 'stub_body',
    },
  ]
}

export const getPostStub = async (): Promise<Post> => {
  return {
    userId: 1,
    id: 1,
    title: 'stub_title',
    body: 'stub_body',
  }
}

export const createPostStub = async (body: CreatePostBody): Promise<Post> => {
  return {
    ...body,
    userId: 1,
    id: 1,
    title: 'stub_title',
    body: 'stub_body',
  }
}
