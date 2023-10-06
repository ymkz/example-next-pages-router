/**
 * @see https://jsonplaceholder.typicode.com/guide/
 */

import {
  createPostStub,
  getPostStub,
  getPostsStub,
} from '~/repositories/posts/stub'
import type { CreatePostBody, Post } from '~/repositories/posts/type'
import type { Result } from '~/utils/error'
import { logger } from '~/utils/log'
import { incrementErrorCount } from '~/utils/metric'

export const getPosts = async (): Promise<Result<Post[]>> => {
  if (process.env.USE_STUB === 'true') {
    const stub = getPostsStub()
    return [stub, null]
  }

  try {
    const response = await fetch(
      `${process.env.JSONPLACEHOLDER_API_URL}/posts?_start=0&_limit=10`,
      { method: 'GET' },
    )

    if (!response.ok) {
      const data = await response.json()

      incrementErrorCount('repositories.posts.getPosts.error')
      logger.error(data, `Post一覧の取得に失敗しました`)

      return [null, { status: response.status, data }]
    }

    const data = await response.json()
    return [data, null]
  } catch (err) {
    incrementErrorCount('repositories.posts.getPosts.exception')
    logger.error(err, `Post一覧の取得で例外が発生しました`)

    return [null, { status: 500 }]
  }
}

export const getPost = async (id: Post['id']): Promise<Result<Post>> => {
  if (process.env.USE_STUB === 'true') {
    const stub = getPostStub()
    return [stub, null]
  }

  try {
    const response = await fetch(
      `${process.env.JSONPLACEHOLDER_API_URL}/posts/${id}`,
      { method: 'GET' },
    )

    if (!response.ok) {
      const data = await response.json()

      incrementErrorCount('repositories.posts.getPost.error')
      logger.error(data, `Postの取得に失敗しました id=${id}`)

      return [null, { status: response.status, data }]
    }

    const data = await response.json()
    return [data, null]
  } catch (err) {
    incrementErrorCount('repositories.posts.getPost.exception')
    logger.error(err, `Postの取得で例外が発生しました id=${id}`)

    return [null, { status: 500 }]
  }
}

export const createPost = async (
  body: CreatePostBody,
): Promise<Result<Post>> => {
  if (process.env.USE_STUB === 'true') {
    const stub = createPostStub(body)
    return [stub, null]
  }

  try {
    const response = await fetch(
      `${process.env.JSONPLACEHOLDER_API_URL}/posts`,
      { method: 'POST', body: JSON.stringify(body) },
    )

    if (!response.ok) {
      const data = await response.json()

      incrementErrorCount('repositories.posts.createPost.error')
      logger.error(data, `Postの作成に失敗しました`)

      return [null, { status: response.status, data }]
    }

    const data = await response.json()
    return [data, null]
  } catch (err) {
    incrementErrorCount('repositories.posts.createPost.exception')
    logger.error(err, `Postの作成で例外が発生しました`)

    return [null, { status: 500 }]
  }
}
