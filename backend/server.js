require('dotenv').config()
const express = require('express')
const cors = require('cors')
const connectDB = require('./db')

const app = express()

connectDB()

app.use(cors({ origin: ['http://localhost:3000', 'http://localhost:3001'] }))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ limit: '10mb', extended: true }))

app.use('/api/auth',         require('./routes/auth'))
app.use('/api/packages',     require('./routes/packages'))
app.use('/api/team',         require('./routes/team'))
app.use('/api/testimonials', require('./routes/testimonials'))
app.use('/api/bookings',     require('./routes/bookings'))

app.use((err, req, res, next) => {
  console.error(err.message)
  res.status(500).json({ error: err.message })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
