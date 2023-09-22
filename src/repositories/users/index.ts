/**
 * @see https://jsonplaceholder.typicode.com/guide/
 */

import axios from 'axios'

import { getUserStub } from '~/repositories/users/stub'
import type { User } from '~/repositories/users/type'
import { logger } from '~/utils/log'
import { incrementErrorCount } from '~/utils/metrics'

export const getUser = async (id: User['id']): Promise<User | undefined> => {
  if (process.env.USE_STUB === 'true') {
    return getUserStub()
  }

  try {
    const response = await axios.get<User>(
      `${process.env.JSONPLACEHOLDER_API_URL}/users/${id}`,
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
      incrementErrorCount('getUser.NotFound')
      logger.error(err, `存在しないUserの取得です id=${id}`)
      return undefined
    }

    incrementErrorCount('getUser.Fail')
    logger.error(err, `Userの取得に失敗しました id=${id}`)
    throw new Error(`Userの取得に失敗しました id=${id}`, {
      cause: err,
    })
  }
}
