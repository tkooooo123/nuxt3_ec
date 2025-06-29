import Article from '~/server/models/Article'
import { H3Event } from "h3";

export default defineEventHandler(async (event: H3Event) => {
  try {
    const articles = await Article.find().sort({ date: -1 }) // 依公告日期倒序排列

     const data = articles.map((item: any) => ({
       
      id: item._id.toString(),
      title: item.title,
      author: item.author,
      tags: item.tags,
      imageUrl: item.imageUrl,
      is_public: item.is_public,
      date: item.date,
      content: item.content
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
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message || '無法取得文章',
    })
  }
})