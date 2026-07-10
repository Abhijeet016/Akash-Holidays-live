const router = require('express').Router()
const Booking = require('../models/Booking')

router.get('/', async (req, res) => {
  const bookings = await Booking.find().sort({ createdAt: -1 })
  res.json(bookings)
})

router.post('/', async (req, res) => {
  const booking = await Booking.create(req.body)
  res.status(201).json(booking)
})

router.patch('/:id/status', async (req, res) => {
  const booking = await Booking.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true }
  )
  res.json(booking)
})

module.exports = router
