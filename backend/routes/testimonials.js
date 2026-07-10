const router = require('express').Router()
const Testimonial = require('../models/Testimonial')

router.get('/', async (req, res) => {
  const testimonials = await Testimonial.find()
  res.json(testimonials)
})

router.post('/', async (req, res) => {
  const testimonial = await Testimonial.create(req.body)
  res.status(201).json(testimonial)
})

router.delete('/:id', async (req, res) => {
  await Testimonial.findByIdAndDelete(req.params.id)
  res.json({ message: 'Testimonial deleted' })
})

module.exports = router
