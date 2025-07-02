import Product from '~/server/models/Product'
import Category from '~/server/models/Category'
import { H3Event } from 'h3'

export default defineEventHandler(async (event: H3Event) => {
  try {
    // 取得所有商品，並帶出分類資訊，依建立時間倒序排列
    const products = await Product.find()
      .populate('category')
      .sort({ createdAt: -1 })

    const data = products.map((item: any) => ({
      id: item._id.toString(),
      name: item.name,
      image: item.image,
      imagesUrl: item.imagesUrl,
      description: item.description,
      content: item.content,
      quantity: item.quantity,
      price: item.price,
      isEnabled: item.isEnabled,
      unit: item.unit,
      category: item.category
        ? {
            id: item.category._id?.toString?.() || '',
            name: item.category.name || '',
            description: item.category.description || ''
          }
        : null,
      createdAt: item.createdAt
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
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message || '無法取得商品'
    })
  }
})