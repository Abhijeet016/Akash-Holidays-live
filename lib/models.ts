import mongoose, { Schema } from 'mongoose'

export const Package = mongoose.models.Package || mongoose.model('Package', new Schema({
  img:      { type: String, required: true },
  dest:     { type: String, required: true },
  nights:   { type: String, required: true },
  persons:  { type: String, required: true },
  discount: { type: String, required: true },
  desc:     { type: String, required: true },
}, { timestamps: true }))

export const Booking = mongoose.models.Booking || mongoose.model('Booking', new Schema({
  name:        { type: String, required: true },
  email:       { type: String, required: true },
  phone:       { type: String, required: true },
  destination: { type: String, required: true },
  date:        { type: Date,   required: true },
  persons:     { type: Number, required: true },
  message:     { type: String },
  status:      { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
}, { timestamps: true }))

export const Team = mongoose.models.Team || mongoose.model('Team', new Schema({
  img:  { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, required: true },
}, { timestamps: true }))

export const Testimonial = mongoose.models.Testimonial || mongoose.model('Testimonial', new Schema({
  name: { type: String, required: true },
  loc:  { type: String, required: true },
  text: { type: String, required: true },
}, { timestamps: true }))
