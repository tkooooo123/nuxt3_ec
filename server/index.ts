import mongoose from 'mongoose'

export default async () => {
  const url = process.env.MONGO_URL|| 'mongodb://localhost:27017/testt'

  if (mongoose.connection.readyState === 1) {
    return mongoose
  }

  try {
    await mongoose.connect(url)
    console.log('MongoDB connected')
  } catch (error) {
    console.error('MongoDB connection error:', error)
  }

  return mongoose
}