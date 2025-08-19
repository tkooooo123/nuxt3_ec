// server/utils/mongoose.js
import mongoose from 'mongoose'

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
    await Promise.all([
      import('../models/User'),
      import('../models/Product'),
      import('../models/Order'),
      import('../models/Category'),
      import('../models/Cart'),
      import('../models/Article')
    ])
    console.log('✅ Models loaded successfully')
  } catch (error) {
    console.error('Error loading models:', error)
  }
}