// server/utils/mongoose.js
import mongoose from 'mongoose'

// 確保所有模型都被載入
import '../models/User'
import '../models/Product'
import '../models/Order'

let isConnected = false

export const connectDB = async () => {
  if (isConnected) {
    return
  }

  try {
    await mongoose.connect(process.env.MONGO_URL as string)
    isConnected = true
    console.log('MongoDB connected successfully')
  } catch (error) {
    console.error('MongoDB connection error:', error)
    throw error
  }
}