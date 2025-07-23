import Order from '~/server/models/Order'
import { connectDB } from '~/server/utils/mongoose'
import type { IUser } from '~/server/models/User'

export default defineEventHandler(async (event) => {
  try {
    await connectDB()
    // 取得訂單 id
    const id = event.context.params?.id

    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: '缺少訂單 ID'
      })
    }
    // 查詢訂單，並帶出 user 詳細資料
    const order = await Order.findById(id)
      .populate<{ user: IUser }>('user')
      .populate('items.product')
      .lean()
    if (!order) {
      throw createError({
        statusCode: 404,
        statusMessage: '找不到訂單'
      })
    }

    const result = {
      id: order._id,
      user: {
        userId: order.user._id,
        name: order.user.name,
        email: order.user.email
      },
      items: order.items.map((item: any) => ({
        name: item.product.name,
        image: item.product.image,
        quantity: item.quantity,
        price: item.price
      })),
      total: order.total,
      shipping: order.shipping,
      status: order.status,
      payment: order.payment,
      sn: order.sn,
      createdAt: order.createdAt
    }
    return {
      message: '取得成功!',
      data: result
    }
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message || '伺服器錯誤'
    })
  }
})
