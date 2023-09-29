import type { CreatePostBody, Post } from '~/repositories/posts/type'

export const getPostsStub = (): Post[] => {
  return [
    {
      userId: 1,
      id: 1,
      title: 'stub_title',
      body: 'stub_body',
    },
  ]
}

export const getPostStub = (): Post => {
  return {
    userId: 1,
    id: 1,
    title: 'stub_title',
    body: 'stub_body',
  }
}

export const createPostStub = (body: CreatePostBody): Post => {
  return {
    ...body,
    userId: 1,
    id: 1,
    title: 'stub_title',
    body: 'stub_body',
  }
}
