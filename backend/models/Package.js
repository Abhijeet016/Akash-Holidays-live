const mongoose = require('mongoose')

const packageSchema = new mongoose.Schema({
  img:     { type: String, required: true },
  dest:    { type: String, required: true },
  nights:  { type: String, required: true },
  persons: { type: String, required: true },
  price:   { type: String, required: true },
  desc:    { type: String, required: true },
}, { timestamps: true })

module.exports = mongoose.model('Package', packageSchema)
