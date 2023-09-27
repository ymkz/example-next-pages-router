/**
 * @see https://jsonplaceholder.typicode.com/guide/
 */

import type { AxiosRequestConfig } from 'axios'
import axios, { AxiosError } from 'axios'

import { getUserStub } from '~/repositories/users/stub'
import type { User } from '~/repositories/users/type'
import { AppError } from '~/utils/error'
import { logger } from '~/utils/log'
import { incrementErrorCount } from '~/utils/metrics'

export const getUser = async (id: User['id']): Promise<User> => {
  if (process.env.USE_STUB === 'true') {
    return getUserStub()
  }

  const url = `${process.env.JSONPLACEHOLDER_API_URL}/users/${id}`
  const config: AxiosRequestConfig = { timeout: 3000 }

  try {
    const response = await axios.get<User>(url, config)
    return response.data
  } catch (err) {
    incrementErrorCount('getUser.Fail')
    logger.error(err, `Userの取得に失敗しました id=${id}`)

    if (err instanceof AxiosError) {
      throw new AppError({
        message: `Userの取得に失敗しました id=${id}`,
        status: err.response?.status ?? 500,
        url,
      })
    }

    throw new Error(`Userの取得に失敗しました id=${id}`, {
      cause: err,
    })
  }
}
