/**
 * @see https://jsonplaceholder.typicode.com/guide/
 */

import { getUserStub } from '~/repositories/users/stub'
import type { User } from '~/repositories/users/type'
import type { Result } from '~/utils/error'
import { logger } from '~/utils/log'
import { incrementErrorCount } from '~/utils/metric'

export const getUser = async (): Promise<Result<User>> => {
  if (process.env.USE_STUB === 'true') {
    const stub = getUserStub()
    return [stub, null]
  }

  try {
    const response = await fetch(
      `${process.env.JSONPLACEHOLDER_API_URL}/users/1`,
      { method: 'GET' },
    )

    if (!response.ok) {
      const data = await response.json()

      incrementErrorCount('repositories.users.getUser.error')
      logger.error(data, `Userの取得に失敗しました`)

      return [null, { status: response.status, data }]
    }

    const data = await response.json()
    return [data, null]
  } catch (err) {
    incrementErrorCount('repositories.users.getUser.exception')
    logger.error(err, `Userの取得で例外が発生しました`)

    return [null, { status: 500 }]
  }
}
