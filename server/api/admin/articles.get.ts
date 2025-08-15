import Article from '~/server/models/Article'
import { H3Event } from 'h3'
import { connectDB } from '~/server/utils/mongoose'
import { verifyAdminAuth } from '~/server/utils/auth'

export default defineEventHandler(async (event: H3Event) => {
  try {
    // 驗證管理員權限
    await verifyAdminAuth(event)
    await connectDB()
    const articles = await Article.find().sort({ date: -1 }).lean() // 依公告日期倒序排列

    const data = articles.map((item) => ({
      id: item._id.toString(),
      title: item.title,
      author: item.author,
      tags: item.tags,
      imageUrl: item.imageUrl,
      is_public: item.is_public,
      date: item.date,
      content: item.content
    }))

    return event.respondWith(
      new Response(
        JSON.stringify({
          message: '取得成功!',
          data
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      )
    )
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
