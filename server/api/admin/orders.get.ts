import Order from '~/server/models/Order'
import { connectDB } from '~/server/utils/mongoose'
export default defineEventHandler(async (event) => {
  try {
    await connectDB()
    // 取得所有訂單，並帶出 user 詳細資料
    const orders = await Order.find().populate('user').populate('items.product')
    
    const data = orders.map((order) => ({
      id: order._id.toString(),
      userId: order.user._id.toString(),
      items: order.items.map((item:any) => ({
        name: item.product.name,
        image: item.product.image,
        quantity: item.quantity,
        price: item.product.price
      })),
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
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message || '伺服器錯誤'
    })
  }
})