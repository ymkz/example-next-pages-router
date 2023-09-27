import axios, { AxiosError } from 'axios'
import { describe, expect, test, vi } from 'vitest'

import { createPost, getPost, getPosts } from '~/repositories/posts'
import { AppError } from '~/utils/error'

describe(getPosts.name, () => {
  test('Post一覧の取得に成功した場合、レスポンスボディーを返す', async () => {
    const spyAxiosGet = vi.spyOn(axios, 'get').mockResolvedValue({
      data: [
        {
          userId: 0,
          id: 1,
          title: 'mocked_title',
          body: 'mocked_body',
        },
      ],
    })

    const actual = getPosts()

    await expect(actual).resolves.toStrictEqual([
      {
        userId: 0,
        id: 1,
        title: 'mocked_title',
        body: 'mocked_body',
      },
    ])
    expect(spyAxiosGet).toHaveBeenCalledTimes(1)
    expect(spyAxiosGet).toHaveBeenCalledWith(
      `${process.env.JSONPLACEHOLDER_API_URL}/posts?_start=0&_limit=10`,
      { timeout: 3000 },
    )
  })

  test('Post一覧の取得に失敗した場合、AppErrorをスローする', async () => {
    const spyAxiosGet = vi
      .spyOn(axios, 'get')
      .mockRejectedValue(new AxiosError())

    const actual = getPosts()

    await expect(actual).rejects.toBeInstanceOf(AppError)
    expect(spyAxiosGet).toHaveBeenCalledTimes(1)
    expect(spyAxiosGet).toHaveBeenCalledWith(
      `${process.env.JSONPLACEHOLDER_API_URL}/posts?_start=0&_limit=10`,
      { timeout: 3000 },
    )
  })
})

describe(getPost.name, () => {
  test('Postの取得に成功した場合、レスポンスのデータを返す', async () => {
    const spyAxiosGet = vi.spyOn(axios, 'get').mockResolvedValue({
      data: {
        userId: 0,
        id: 1,
        title: 'mocked_title',
        body: 'mocked_body',
      },
    })

    const actual = getPost(0)

    await expect(actual).resolves.toStrictEqual({
      userId: 0,
      id: 1,
      title: 'mocked_title',
      body: 'mocked_body',
    })
    expect(spyAxiosGet).toHaveBeenCalledTimes(1)
    expect(spyAxiosGet).toHaveBeenCalledWith(
      `${process.env.JSONPLACEHOLDER_API_URL}/posts/0`,
      { timeout: 3000 },
    )
  })

  test('Postの取得に失敗した場合、AppErrorをスローする', async () => {
    const spyAxiosGet = vi
      .spyOn(axios, 'get')
      .mockRejectedValue(new AxiosError())

    const actual = getPost(0)

    await expect(actual).rejects.toBeInstanceOf(AppError)
    expect(spyAxiosGet).toHaveBeenCalledTimes(1)
    expect(spyAxiosGet).toHaveBeenCalledWith(
      `${process.env.JSONPLACEHOLDER_API_URL}/posts/0`,
      { timeout: 3000 },
    )
  })
})

describe(createPost.name, () => {
  test('Postの作成に成功した場合、レスポンスのデータを返す', async () => {
    const spyAxiosPost = vi.spyOn(axios, 'post').mockResolvedValue({
      data: {
        userId: 1,
        id: 101,
        title: 'test_title',
        body: 'test_body',
      },
    })

    const actual = createPost({
      title: 'test_title',
      body: 'test_body',
      userId: 1,
    })

    await expect(actual).resolves.toStrictEqual({
      userId: 1,
      id: 101,
      title: 'test_title',
      body: 'test_body',
    })
    expect(spyAxiosPost).toHaveBeenCalledTimes(1)
    expect(spyAxiosPost).toHaveBeenCalledWith(
      `${process.env.JSONPLACEHOLDER_API_URL}/posts`,
      {
        title: 'test_title',
        body: 'test_body',
        userId: 1,
      },
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 3000,
      },
    )
  })

  test('Postの作成に失敗した場合、AppErrorをスローする', async () => {
    const spyAxiosPost = vi
      .spyOn(axios, 'post')
      .mockRejectedValue(new AxiosError())

    const actual = createPost({
      title: 'test_title',
      body: 'test_body',
      userId: 1,
    })

    await expect(actual).rejects.toBeInstanceOf(AppError)
    expect(spyAxiosPost).toHaveBeenCalledTimes(1)
    expect(spyAxiosPost).toHaveBeenCalledWith(
      `${process.env.JSONPLACEHOLDER_API_URL}/posts`,
      {
        title: 'test_title',
        body: 'test_body',
        userId: 1,
      },
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 3000,
      },
    )
  })
})
