import Order from '~/server/models/Order'
import { connectDB } from '~/server/utils/mongoose'
import type { IUser } from '~/server/models/User'
import { verifyAdminAuth } from '~/server/utils/auth'
import { IProduct } from '~/server/models/Product'

export default defineEventHandler(async (event) => {
  // 驗證管理員權限
  await verifyAdminAuth(event)

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
      .populate<{product:IProduct}>('items.product')
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
      items: order.items.map((item) => {
        const product = item.product as unknown as IProduct;
        return ({
          id: product._id,
          name: product.name,
          image: product.image,
          quantity: item.quantity,
          price: item.price,
          origin_price: product.origin_price,
          stock: product.quantity,
          unit: product.unit
        })
      }),
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
  } catch (error: unknown) {
    if (typeof error === 'object' && error !== null && 'statusCode' in error) {
      throw error
    }
    throw createError({
      statusCode: 500,
      statusMessage: '伺服器錯誤，請稍後再試'
    })
  }
})
