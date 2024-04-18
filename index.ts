import app from './app'
import dotenv from 'dotenv'
import { connectToDB } from './config/dbConnect'

dotenv.config()

connectToDB()

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`Listening on port ${port}!!..`)
})
