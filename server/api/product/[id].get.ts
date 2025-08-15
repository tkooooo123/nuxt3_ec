import Product from '~/server/models/Product'
import type { IProduct } from '~/server/models/Product'
import type { ICategory } from '~/server/models/Category'
import { H3Event } from 'h3'
import { connectDB } from '~/server/utils/mongoose'

export default defineEventHandler(async (event: H3Event) => {
  try {
    await connectDB()
    // 從 query 參數取得 product ID
    const query = event.context.params
    const productId = query?.id

    if (!productId) {
      throw createError({
        statusCode: 400,
        statusMessage: '缺少商品 ID 參數'
      })
    }

    // 驗證 ID 格式
    if (typeof productId !== 'string' || !productId.match(/^[0-9a-fA-F]{24}$/)) {
      throw createError({
        statusCode: 400,
        statusMessage: '無效的商品 ID 格式'
      })
    }

    // 查詢商品並帶出分類資訊
    const product = await Product.findById(productId).populate('category') as IProduct & { category: ICategory } | null

    if (!product) {
      throw createError({
        statusCode: 404,
        statusMessage: '找不到該商品'
      })
    }

    // 檢查商品是否啟用
    if (!product.isEnabled) {
      throw createError({
        statusCode: 404,
        statusMessage: '該商品已下架'
      })
    }


    // 格式化回傳資料
    const data = {
      id: product._id,
      name: product.name,
      image: product.image,
      imagesUrl: product.imagesUrl,
      description: product.description,
      content: product.content,
      quantity: product.quantity,
      price: product.price,
      origin_price: product.origin_price,
      unit: product.unit,
      is_hottest: product.is_hottest,
      is_newest: product.is_newest,
      notice: product.notice,
      material: product.material,
      size: product.size,
      style: product.style,
      category: product.category
        ? {
            id: product.category._id?.toString?.() || '',
            name: product.category.name || '',
            description: product.category.description || ''
          }
        : null,
      createdAt: product.createdAt
    }

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
    if (typeof error === 'object' && error !== null && 'statusCode' in error) {
      throw error
    }

    // 其他錯誤
    throw createError({
      statusCode: 500,
      statusMessage: '無法取得商品資訊，請稍後再試'
    })
  }
})
