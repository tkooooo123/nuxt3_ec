import Order from '~/server/models/Order'
import Product from '~/server/models/Product'
import { connectDB } from '~/server/utils/mongoose'
import type { IProduct } from '~/server/models/Product'

export default defineEventHandler(async (event) => {
  try {
    await connectDB()
    const id = event.context.params?.id
    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: '缺少訂單 ID'
      })
    }
    // 取得訂單
    const order = await Order.findById(id)
    if (!order) {
      throw createError({ statusCode: 404, statusMessage: '找不到訂單' })
    }
    // 恢復商品庫存
    for (const item of order.items) {
      const product = (await Product.findById(item.product)) as IProduct | null
      if (product) {
        product.quantity += item.quantity
        await product.save()
      }
    }
    // 刪除訂單
    await Order.findByIdAndDelete(id)
    return {
      message: '刪除成功!'
    }
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message || '伺服器錯誤'
    })
  }
})
