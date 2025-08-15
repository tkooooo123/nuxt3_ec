import Category from "@/server/models/Category";
import { H3Event } from "h3";
import { connectDB } from '~/server/utils/mongoose'
import { verifyAdminAuth } from '~/server/utils/auth'



export default defineEventHandler(async (event: H3Event) => {
  // 驗證管理員權限
  await verifyAdminAuth(event)
  
  try {
    await connectDB()
    const categories = await Category.find().select("name description").lean(); // 僅選取欄位

    // 將 _id 轉為 id，並回傳乾淨資料
    const data = categories.map(item => ({
      id: item._id.toString(),
      name: item.name,
      description: item.description,
    }));

    return event.respondWith(
      new Response(
        JSON.stringify({
          message: "取得成功!",
          data,
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
