import Article from '~/server/models/Article'
import { H3Event } from 'h3'
import { verifyAdminAuth } from '~/server/utils/auth'

export default defineEventHandler(async (event: H3Event) => {
  try {
    // 驗證管理員權限
    await verifyAdminAuth(event)
    const body = await readBody(event)
    const { id, title, author, tags, content, is_public, date, imageUrl } = body

    if (!id) {
      throw createError({ statusCode: 400, statusMessage: '缺少文章 ID' })
    }
    if (!title) {
      throw createError({ statusCode: 400, statusMessage: '請輸入文章標題' })
    }
    if (!author) {
      throw createError({ statusCode: 400, statusMessage: '請輸入文章作者' })
    }
    if (!tags || tags.length === 0) {
      throw createError({ statusCode: 400, statusMessage: '請輸入文章標籤' })
    }
    if (!content) {
      throw createError({ statusCode: 400, statusMessage: '請輸入文章內容' })
    }
    if (typeof is_public !== 'boolean') {
      throw createError({ statusCode: 400, statusMessage: '請選擇是否公開' })
    }
    if (!date) {
      throw createError({ statusCode: 400, statusMessage: '請選擇公告日期' })
    }
    if (!imageUrl) {
      throw createError({ statusCode: 400, statusMessage: '請先取得圖片網址' })
    }

    const updated = await Article.findByIdAndUpdate(
      id,
      { title, author, tags, content, is_public, date, imageUrl },
      { new: true }
    )

    if (!updated) {
      throw createError({ statusCode: 404, statusMessage: '找不到文章' })
    }

    return {
      message: '更新成功！',
      data: updated
    }
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message || '伺服器錯誤'
    })
  }
})
