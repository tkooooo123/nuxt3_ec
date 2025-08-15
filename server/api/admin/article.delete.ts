import Article from '~/server/models/Article'
import { H3Event } from 'h3'
import { verifyAdminAuth } from '~/server/utils/auth'

export default defineEventHandler(async (event: H3Event) => {
  try {
    // 驗證管理員權限
    await verifyAdminAuth(event)
   const body = await readBody(event);
    const { id } = body;

    if (!id) {
      throw createError({ statusCode: 400, statusMessage: '缺少文章 ID' })
    }

    const deleted = await Article.findByIdAndDelete(id)

    if (!deleted) {
      throw createError({ statusCode: 404, statusMessage: '找不到該文章' })
    }

   return event.respondWith(
      new Response(
        JSON.stringify({
          message: "刪除成功!",
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      )
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw createError({
        statusCode: 500,
        statusMessage: error.message
      })
    }
    throw createError({
      statusCode: 500,
      statusMessage: '伺服器錯誤'
    })
  }
})