import Order from '~/server/models/Order'
import { connectDB } from '~/server/utils/mongoose'
import { verifyAdminAuth } from '~/server/utils/auth'
import type { IProduct } from '~/server/models/Product'

export default defineEventHandler(async (event) => {
  // 驗證管理員權限
  await verifyAdminAuth(event)

  try {
    await connectDB()
    // 取得所有訂單，並帶出 user 詳細資料
    const orders = await Order.find().populate('user').populate<{ product: IProduct }>('items.product').lean()

    const data = orders.map((order) => ({
      id: order._id.toString(),
      userId: order.user._id.toString(),
      items: order.items.map((item) => {
        const product = item.product as unknown as IProduct
        return ({
          name: product.name,
          image: product.image,
          quantity: item.quantity,
          price: product.price
        })
      }),
      total: order.total,
      status: order.status,
      shipping: order.shipping
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
})
