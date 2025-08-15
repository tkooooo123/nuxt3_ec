import Category from "@/server/models/Category";
import { H3Event } from "h3";
import { verifyAdminAuth } from '~/server/utils/auth'

export default defineEventHandler(async (event: H3Event) => {
  try {
    // 驗證管理員權限
    await verifyAdminAuth(event)
    const body = await readBody(event);
   
    const { name, description } = body;

    if (!name) {
      return createError({ statusCode: 400, statusMessage: '請輸入分類名稱' });
    }

    if (!description) {
      return  createError({ statusCode: 400, statusMessage: '請輸入分類描述' });
    }

    const category = await Category.create({
      name,
      description,
    });
    if (category) {
      return {
           message: "新增成功!",
      }
    }
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
