import Category from "@/server/models/Category";
import { H3Event } from "h3";
import { verifyAdminAuth } from '~/server/utils/auth'
export default defineEventHandler(async (event: H3Event) => {
  try {
     // 驗證管理員權限
    await verifyAdminAuth(event)
    const body = await readBody(event);
    const { id, name, description } = body;

    if (!id) {
      return createError({ statusCode: 400, statusMessage: '請提供分類 ID' });
    }

    if (!name) {
      return createError({ statusCode: 400, statusMessage: '請輸入分類名稱' });
    }

    if (!description) {
      return createError({ statusCode: 400, statusMessage: '請輸入分類描述' });
    }

    const category = await Category.findByIdAndUpdate(
      id,
      { name, description },
      { new: true } //回傳更新後資料
    );

    if (!category) {
      return createError({ statusCode: 404, statusMessage: '找不到分類' });
    }

     return event.respondWith(
      new Response(
        JSON.stringify({
          message: "更新成功!",
          
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
});