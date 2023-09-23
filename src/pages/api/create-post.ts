import type { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'

import { createPost } from '~/repositories/posts'
import type { Post } from '~/repositories/posts/type'
import { logger } from '~/utils/log'
import { incrementAccessCount, incrementErrorCount } from '~/utils/metrics'

const schema = z.object({
  title: z.string().nonempty(),
  body: z.string().nonempty(),
  userId: z.number(),
})

type Response = { ok: true; result: Post } | { ok: false; message: string }

export default async function route(
  req: NextApiRequest,
  res: NextApiResponse<Response>,
) {
  incrementAccessCount('/api/create-post', req.method!)

  if (req.method !== 'POST') {
    incrementErrorCount('api.create-post.MethodNotAllowed')
    logger.error(
      `/api/create-postに予期しないメソッドでリクエストされました method=${req.method}`,
    )
    return res.status(405).json({
      ok: false,
      message: 'Method Not Allowed',
    })
  }

  const body = schema.safeParse(req.body)

  if (!body.success) {
    incrementErrorCount('api.create-post.BadRequest')
    logger.error(
      { issues: body.error.issues },
      `/api/create-postに不正なボディでリクエストされました body=${JSON.stringify(
        req.body,
      )}`,
    )
    // FIXME: zodのerror.messageのフォーマット
    return res.status(400).json({
      ok: false,
      message: body.error.message,
    })
  }

  try {
    const result = await createPost(body.data)

    return res.status(200).json({
      ok: true,
      result,
    })
  } catch (err) {
    incrementErrorCount('api.create-post.InternalServerError')
    logger.error(err, `/api/create-postでエラーが発生しました`)
    return res.status(500).json({
      ok: false,
      message: 'Internal Server Error',
    })
  }
}
