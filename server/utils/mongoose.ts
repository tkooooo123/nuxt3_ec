// server/utils/mongoose.js
import mongoose from 'mongoose'

// 確保所有模型都被載入
import '../models/User'
import '../models/Product'
import '../models/Order'
import '../models/Category'
import '../models/Cart'
import '../models/Article'

let isConnected = false

export const connectDB = async () => {
  if (isConnected) {
    return
  }

  try {
    await mongoose.connect(process.env.MONGO_URL as string)
    isConnected = true
    console.log('MongoDB connected successfully')

     // 載入所有模型以確保它們被註冊
     await loadModels()
  } catch (error) {
    console.error('MongoDB connection error:', error)
    throw error
  }
}

// 載入所有模型的函數
const loadModels = async () => {
  try {
    // 動態載入所有模型
    const { default: User } = await import('../models/User')
    const { default: Product } = await import('../models/Product')
    const { default: Order } = await import('../models/Order')
    const { default: Category } = await import('../models/Category')
    const { default: Cart } = await import('../models/Cart')
    const { default: Article } = await import('../models/Article')
    
    console.log('Models loaded:', {
      User: !!User,
      Product: !!Product,
      Order: !!Order,
      Category: !!Category,
      Cart: !!Cart,
      Article: !!Article
    })
  } catch (error) {
    console.error('Error loading models:', error)
  }
}