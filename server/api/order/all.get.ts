import Order from '~/server/models/Order'
import { IProduct } from '~/server/models/Product'
import type { IUser } from '~/server/models/User'
import { verifyJWTToken } from '~/server/utils/auth'
import { connectDB } from '~/server/utils/mongoose'


// type PopulatedOrder = IOrder & {
//   user: IUser
// }

export default defineEventHandler(async (event) => {
  try {
    await connectDB()
    const { userId } = verifyJWTToken(event)
    if(!userId) return;
    

    const orders = await Order.find({user: userId})
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
      items: order.items.map((item) => {
        const product = item.product as unknown as IProduct
        return ({
          id: item.product?._id,
          name: product?.name,
          image: product?.image,
          quantity: item.quantity,
          price: item.price,
          unit: product?.unit
        })
      }),
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
