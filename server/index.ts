import mongoose from 'mongoose'
import User from '@/server/models/User'
import Product from '@/server/models/Product'
import { seedUser, seedProduct } from './seed/seedData'
import { connectDB } from './utils/mongoose'
export default async () => {
  const url = process.env.MONGO_URL || 'mongodb://localhost:27017/testt'

  if (mongoose.connection.readyState === 1) {
    return mongoose
  }

  try {
    await connectDB()
    const userCount = await User.countDocuments()
    const productCount = await Product.countDocuments()
    if (userCount === 0) {
      await seedUser()
    }
 
     if(productCount === 0) {
      seedProduct()
     }
  } catch (error) {
    console.error('MongoDB connection error:', error)
  }

  return mongoose
}
