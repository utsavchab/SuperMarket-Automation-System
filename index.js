const app = require('./app')

const dotenv = require('dotenv')
const { connectToDB } = require('./config/dbConnect')
dotenv.config()

connectToDB()
app.listen(3000, () => {
  console.log('Listening on port 3000!!..')
})
