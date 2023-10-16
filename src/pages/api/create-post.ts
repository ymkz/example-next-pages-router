import type { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'

import { createPost } from '~/repositories/posts'
import type { Post } from '~/repositories/posts/type'
import { logger } from '~/utils/log'
import { incrementErrorCount, incrementWarnCount } from '~/utils/metric'

const schema = z.object({
  title: z.string().min(1),
  body: z.string().min(1),
  userId: z.coerce.number(),
})

type Response = Post | { reason: string }

export default async function route(
  req: NextApiRequest,
  res: NextApiResponse<Response>,
) {
  if (req.method !== 'POST') {
    incrementWarnCount('api.create-post.MethodNotAllowed')
    logger.warn(
      `/api/create-postに予期しないメソッドでリクエストされました method=${req.method}`,
    )
    return res.status(405).json({
      reason: '不正なメソッドでのリクエストです',
    })
  }

  const body = schema.safeParse(req.body)

  if (!body.success) {
    incrementWarnCount('api.create-post.BadRequest')
    logger.warn(
      { request: req.body, issues: body.error.issues },
      `/api/create-postに不正なボディでリクエストされました`,
    )
    return res.status(400).json({
      // FIXME: バリデーションにひっかかった理由をレスポンスしたい
      reason: '不正なボディでリクエストされました',
    })
  }

  try {
    const [result, error] = await createPost(body.data)

    if (error) {
      return res
        .status(error.status)
        .json({ reason: 'Post作成APIリクエストでエラーが発生しました' })
    }

    return res.status(200).json(result)
  } catch (err) {
    incrementErrorCount('api.create-post.InternalServerError')
    logger.error(err, `/api/create-postでエラーが発生しました`)

    return res.status(500).json({ reason: 'エラーが発生しました' })
  }
}
