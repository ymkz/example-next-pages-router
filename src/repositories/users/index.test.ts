import axios, { AxiosError } from 'axios'
import { describe, expect, test, vi } from 'vitest'

import { getUser } from '~/repositories/users'

describe(getUser.name, () => {
  test('取得に成功した場合、レスポンスボディーを返す', async () => {
    const spyAxiosGet = vi.spyOn(axios, 'get').mockResolvedValue({
      data: {
        id: 0,
        name: 'mocked_name',
        username: 'mocked_username',
        email: 'mocked_email',
      },
    })

    const actual = getUser(0)

    await expect(actual).resolves.toStrictEqual({
      id: 0,
      name: 'mocked_name',
      username: 'mocked_username',
      email: 'mocked_email',
    })
    expect(spyAxiosGet).toHaveBeenCalledTimes(1)
    expect(spyAxiosGet).toHaveBeenCalledWith(
      `${process.env.JSONPLACEHOLDER_API_URL}/users/0`,
      { timeout: 3000 },
    )
  })

  test('存在しないidが渡された場合、undefinedが返却される', async () => {
    const spyAxiosGet = vi.spyOn(axios, 'get').mockRejectedValue(
      // @ts-ignore
      new AxiosError('', '', '', '', { status: 404 }),
    )

    const actual = getUser(0)

    await expect(actual).resolves.toBeUndefined()
    expect(spyAxiosGet).toHaveBeenCalledTimes(1)
    expect(spyAxiosGet).toHaveBeenCalledWith(
      `${process.env.JSONPLACEHOLDER_API_URL}/users/0`,
      { timeout: 3000 },
    )
  })

  test('取得に失敗した場合、例外をスローする', async () => {
    const spyAxiosGet = vi
      .spyOn(axios, 'get')
      .mockRejectedValue(new AxiosError())

    const actual = getUser(0)

    await expect(actual).rejects.toThrow('Userの取得に失敗しました id=0')
    expect(spyAxiosGet).toHaveBeenCalledTimes(1)
    expect(spyAxiosGet).toHaveBeenCalledWith(
      `${process.env.JSONPLACEHOLDER_API_URL}/users/0`,
      { timeout: 3000 },
    )
  })
})
