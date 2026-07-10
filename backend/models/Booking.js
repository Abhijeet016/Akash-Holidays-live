const mongoose = require('mongoose')

const bookingSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  email:       { type: String, required: true },
  phone:       { type: String, required: true },
  destination: { type: String, required: true },
  date:        { type: Date,   required: true },
  persons:     { type: Number, required: true },
  message:     { type: String },
  status:      { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
}, { timestamps: true })

module.exports = mongoose.model('Booking', bookingSchema)
