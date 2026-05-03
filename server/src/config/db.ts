import mongoose from 'mongoose'

export const connectDB = async (): Promise<void> => {
  const uri = process.env.MONGODB_URI

  if (!uri) {
    throw new Error('MONGODB_URI is not defined in environment variables')
  }

  try {
    await mongoose.connect(uri)
    // eslint-disable-next-line no-console
    console.log('[db] Connected to MongoDB')
  } catch (error) {
    console.error('[db] Connection failed:', error)
    process.exit(1)
  }
}
