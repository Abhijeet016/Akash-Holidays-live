import mongoose from 'mongoose'

// Cache connection across hot reloads in dev and serverless invocations
const globalWithMongoose = global as typeof global & { mongoose?: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null } }

if (!globalWithMongoose.mongoose) {
  globalWithMongoose.mongoose = { conn: null, promise: null }
}

const cached = globalWithMongoose.mongoose

export async function connectDB() {
  const MONGO_URI = process.env.MONGO_URI
  if (!MONGO_URI) throw new Error('MONGO_URI is not defined in environment variables')
  if (cached.conn) return cached.conn
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_URI).then(m => m)
  }
  cached.conn = await cached.promise
  return cached.conn
}
