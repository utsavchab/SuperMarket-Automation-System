import mongoose from 'mongoose'

export const connectToDB = () => {
  mongoose.connect(String(process.env.MONGO_URI)) // Assuming MONGO_URI is a string

  const db = mongoose.connection

  db.on('error', console.error.bind(console, 'connection error:'))
  db.once('open', () => {
    console.log('Database connected')
  })
}
