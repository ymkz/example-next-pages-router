/**
 * @see https://jsonplaceholder.typicode.com/guide/
 */

import axios from 'axios'

import { getPostStub, getPostsStub } from '~/repositories/posts/stub'
import type { Post } from '~/repositories/posts/type'
import { logger } from '~/utils/log'
import { incrementErrorCount } from '~/utils/metrics'

export const getPosts = async (): Promise<Post[]> => {
  if (process.env.USE_STUB === 'true') {
    return getPostsStub()
  }

  try {
    const response = await axios.get<Post[]>(
      `${process.env.JSONPLACEHOLDER_API_URL}/posts?_start=0&_limit=10`,
      {
        timeout: 3000,
      },
    )
    return response.data
  } catch (err) {
    incrementErrorCount('getPosts.Fail')
    logger.error(err, `Post一覧の取得に失敗しました`)
    throw new Error(`Post一覧の取得に失敗しました`, {
      cause: err,
    })
  }
}

export const getPost = async (id: Post['id']): Promise<Post | undefined> => {
  if (process.env.USE_STUB === 'true') {
    return getPostStub()
  }

  try {
    const response = await axios.get<Post>(
      `${process.env.JSONPLACEHOLDER_API_URL}/posts/${id}`,
      {
        timeout: 3000,
      },
    )
    return response.data
  } catch (err) {
    if (
      axios.isAxiosError(err) &&
      err.response?.status === axios.HttpStatusCode.NotFound
    ) {
      incrementErrorCount('getPost.NotFound')
      logger.error(err, `存在しないPostの取得です id=${id}`)
      return undefined
    }

    incrementErrorCount('getPost.Fail')
    logger.error(err, `Postの取得に失敗しました id=${id}`)
    throw new Error(`Postの取得に失敗しました id=${id}`, {
      cause: err,
    })
  }
}
