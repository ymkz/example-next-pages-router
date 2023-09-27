import axios, { AxiosError } from 'axios'
import { describe, expect, test, vi } from 'vitest'

import { getUser } from '~/repositories/users'
import { AppError } from '~/utils/error'

describe(getUser.name, () => {
  test('Userの取得に成功した場合、レスポンスのデータを返す', async () => {
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

  test('Userの取得に失敗した場合、AppErrorをスローする', async () => {
    const spyAxiosGet = vi
      .spyOn(axios, 'get')
      .mockRejectedValue(new AxiosError())

    const actual = getUser(0)

    await expect(actual).rejects.toBeInstanceOf(AppError)
    expect(spyAxiosGet).toHaveBeenCalledTimes(1)
    expect(spyAxiosGet).toHaveBeenCalledWith(
      `${process.env.JSONPLACEHOLDER_API_URL}/users/0`,
      { timeout: 3000 },
    )
  })
})
