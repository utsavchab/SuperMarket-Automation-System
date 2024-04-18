const app = require('./app')
const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/superMarket')

const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () => {
  console.log('Database connected')
})

app.listen(3000, () => {
  console.log('Listening on port 3000!!..')
})
