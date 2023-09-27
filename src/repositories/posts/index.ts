/**
 * @see https://jsonplaceholder.typicode.com/guide/
 */

import type { AxiosRequestConfig } from 'axios'
import axios, { AxiosError } from 'axios'

import {
  createPostStub,
  getPostStub,
  getPostsStub,
} from '~/repositories/posts/stub'
import type { CreatePostBody, Post } from '~/repositories/posts/type'
import { AppError } from '~/utils/error'
import { logger } from '~/utils/log'
import { incrementErrorCount } from '~/utils/metrics'

export const getPosts = async (): Promise<Post[]> => {
  if (process.env.USE_STUB === 'true') {
    return getPostsStub()
  }

  const url = `${process.env.JSONPLACEHOLDER_API_URL}/posts?_start=0&_limit=10`
  const config: AxiosRequestConfig = { timeout: 3000 }

  try {
    const response = await axios.get<Post[]>(url, config)
    return response.data
  } catch (err) {
    incrementErrorCount('getPosts.Fail')
    logger.error(err, `Post一覧の取得に失敗しました`)

    if (err instanceof AxiosError) {
      throw new AppError({
        message: `Post一覧の取得に失敗しました`,
        status: err.response?.status ?? 500,
        url,
      })
    }

    throw new Error(`Post一覧の取得に失敗しました`, {
      cause: err,
    })
  }
}

export const getPost = async (id: Post['id']): Promise<Post> => {
  if (process.env.USE_STUB === 'true') {
    return getPostStub()
  }

  const url = `${process.env.JSONPLACEHOLDER_API_URL}/posts/${id}`
  const config: AxiosRequestConfig = { timeout: 3000 }

  try {
    const response = await axios.get<Post>(url, config)
    return response.data
  } catch (err) {
    incrementErrorCount('getPost.Fail')
    logger.error(err, `Postの取得に失敗しました id=${id}`)

    if (err instanceof AxiosError) {
      throw new AppError({
        message: `Postの取得に失敗しました id=${id}`,
        status: err.response?.status ?? 500,
        url,
      })
    }

    throw new Error(`Postの取得に失敗しました id=${id}`, {
      cause: err,
    })
  }
}

export const createPost = async (body: CreatePostBody) => {
  if (process.env.USE_STUB === 'true') {
    return createPostStub(body)
  }

  const url = `${process.env.JSONPLACEHOLDER_API_URL}/posts`
  const config: AxiosRequestConfig = {
    headers: { 'Content-Type': 'application/json' },
    timeout: 3000,
  }

  try {
    const response = await axios.post<Post>(url, body, config)
    return response.data
  } catch (err) {
    incrementErrorCount('createPost.Fail')
    logger.error(err, `Postの作成に失敗しました`)

    if (err instanceof AxiosError) {
      throw new AppError({
        message: `Postの作成に失敗しました`,
        status: err.response?.status ?? 500,
        url,
      })
    }

    throw new Error(`Postの作成に失敗しました`, {
      cause: err,
    })
  }
}
