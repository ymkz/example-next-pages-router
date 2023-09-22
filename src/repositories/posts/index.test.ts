import axios, { AxiosError } from 'axios'
import { describe, expect, test, vi } from 'vitest'

import { getPost, getPosts } from '~/repositories/posts'

describe(getPosts.name, () => {
  test('取得に成功した場合、レスポンスボディーを返す', async () => {
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

  test('取得に失敗した場合、例外をスローする', async () => {
    const spyAxiosGet = vi.spyOn(axios, 'get').mockRejectedValue(new Error())

    const actual = getPosts()

    await expect(actual).rejects.toThrow('Post一覧の取得に失敗しました')
    expect(spyAxiosGet).toHaveBeenCalledTimes(1)
    expect(spyAxiosGet).toHaveBeenCalledWith(
      `${process.env.JSONPLACEHOLDER_API_URL}/posts?_start=0&_limit=10`,
      { timeout: 3000 },
    )
  })
})

describe(getPost.name, () => {
  test('取得に成功した場合、レスポンスボディーを返す', async () => {
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

  test('存在しないidが渡された場合、undefinedが返却される', async () => {
    const spyAxiosGet = vi.spyOn(axios, 'get').mockRejectedValue(
      // @ts-ignore
      new AxiosError('', '', '', '', { status: 404 }),
    )

    const actual = getPost(0)

    await expect(actual).resolves.toBeUndefined()
    expect(spyAxiosGet).toHaveBeenCalledTimes(1)
    expect(spyAxiosGet).toHaveBeenCalledWith(
      `${process.env.JSONPLACEHOLDER_API_URL}/posts/0`,
      { timeout: 3000 },
    )
  })

  test('取得に失敗した場合、例外をスローする', async () => {
    const spyAxiosGet = vi
      .spyOn(axios, 'get')
      .mockRejectedValue(new AxiosError())

    const actual = getPost(0)

    await expect(actual).rejects.toThrow('Postの取得に失敗しました id=0')
    expect(spyAxiosGet).toHaveBeenCalledTimes(1)
    expect(spyAxiosGet).toHaveBeenCalledWith(
      `${process.env.JSONPLACEHOLDER_API_URL}/posts/0`,
      { timeout: 3000 },
    )
  })
})
