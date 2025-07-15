import mongoose from 'mongoose'

const MONGO_URI = process.env.MONGO_URL || 'mongodb://localhost:27017/testt'

export async function connectDB() {
  if (mongoose.connection.readyState >= 1) {
    // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
    return mongoose
  }

  try {
    await mongoose.connect(MONGO_URI)
    console.log('✅ MongoDB connected')
  } catch (error) {
    console.error('❌ MongoDB connection error:', error)
    throw error
  }

  return mongoose
}
