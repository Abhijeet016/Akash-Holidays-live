const router = require('express').Router()
const Package = require('../models/Package')
const auth = require('../middleware/auth')

router.get('/', async (req, res) => {
  const packages = await Package.find()
  res.json(packages)
})

router.post('/', auth, async (req, res) => {
  const pkg = await Package.create(req.body)
  res.status(201).json(pkg)
})

router.delete('/:id', auth, async (req, res) => {
  await Package.findByIdAndDelete(req.params.id)
  res.json({ message: 'Package deleted' })
})

module.exports = router
