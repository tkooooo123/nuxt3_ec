import Article from "~/server/models/Article";
import { H3Event } from "h3";
import { verifyAdminAuth } from '~/server/utils/auth'

export default defineEventHandler(async (event: H3Event) => {
try {
  // 驗證管理員權限
  await verifyAdminAuth(event)
    const body = await readBody(event);

    const { title, author, tags, content, is_public, date, imageUrl } = body
    if (!title) {
      return createError({ statusCode: 400, statusMessage: '請輸入文章標題' });
    }
     if (!author) {
      return createError({ statusCode: 400, statusMessage: '請輸入文章作者' });
    }
     if (tags.length === 0) {
      return createError({ statusCode: 400, statusMessage: '請輸入文章標籤' });
    }
     if (!content) {
      return createError({ statusCode: 400, statusMessage: '請輸入文章標籤' });
    }
     if (typeof is_public !== 'boolean') {
      return createError({ statusCode: 400, statusMessage: '請選擇是否公開' });
    }
       if (!date) {
      return createError({ statusCode: 400, statusMessage: '請選擇公告日期' });
    }
     if (!imageUrl) {
      return createError({ statusCode: 400, statusMessage: '請先取得圖片網址' });
    }

     const article = await Article.create(body);
        if (article) {
          return {
               message: "新增成功!",
          }
        }
} catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message || "伺服器錯誤",
    });
  }
})