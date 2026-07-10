const router = require('express').Router()
const Team = require('../models/Team')

router.get('/', async (req, res) => {
  const team = await Team.find()
  res.json(team)
})

router.post('/', async (req, res) => {
  const member = await Team.create(req.body)
  res.status(201).json(member)
})

router.delete('/:id', async (req, res) => {
  await Team.findByIdAndDelete(req.params.id)
  res.json({ message: 'Member deleted' })
})

module.exports = router
