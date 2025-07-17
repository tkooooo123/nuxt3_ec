import Order from '~/server/models/Order'
import type { IUser } from '~/server/models/User'
import type { IOrder } from '~/server/models/Order'
import { verifyJWTToken } from '~/server/utils/auth'
import { connectDB } from '~/server/utils/mongoose'
import mongoose from 'mongoose'

type PopulatedOrder = IOrder & {
  user: IUser
}

export default defineEventHandler(async (event) => {
  try {
    await connectDB()
    const { userId } = verifyJWTToken(event)

    const filter: any = {}
    if (userId) {
      filter.user = userId
    }

    // 查詢訂單
    const orders = await Order.find(filter)
    .sort({ createdAt: -1})
    .populate<{ user: IUser }>('user')
    .populate('items.product')
    .lean()
    
    const data = orders.map((order) => ({
      id: order._id,
      user: {
        userId: order.user._id,
        name: order.user.name,
        email: order.user.email
      },
      items: order.items.map((item: any) => ({
        id: item.product?._id,
        name: item.product?.name,
        image: item.product?.image,
        quantity: item.quantity,
        price: item.price,
        unit: item.product?.unit
      })),
      total: order.total,
      shipping: order.shipping,
      status: order.status,
      payment: order.payment,
      sn: order.sn,
      createdAt: order.createdAt
    }))

    return {
      message: '取得成功!',
      data
    }
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message || '伺服器錯誤'
    })
  }
})
