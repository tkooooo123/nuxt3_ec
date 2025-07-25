import Category from "@/server/models/Category";
import { H3Event } from "h3";
import { verifyAdminAuth } from '~/server/utils/auth'

export default defineEventHandler(async (event: H3Event) => {
  try {
    // 驗證管理員權限
    await verifyAdminAuth(event)
    const body = await readBody(event);
    const { id } = body;

    if (!id) {
      return createError({ statusCode: 400, statusMessage: '請提供分類 ID' });
    }

    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      return createError({ statusCode: 404, statusMessage: '找不到分類' });
    }

    return event.respondWith(
      new Response(
        JSON.stringify({
          message: "刪除成功!",
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      )
    );
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message || "伺服器錯誤",
    });
  }
});