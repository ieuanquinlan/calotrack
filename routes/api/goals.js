const express = require('express')
const router = express.Router()
const { validationResult } = require('express-validator')
const auth = require('../../middleware/auth')
const User = require('../../models/User')
const Goal = require('../../models/Goal')

// @route   GET api/goals
// @desc    Get current users calorie goals
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const goal = await Goal.findOne({user: req.user.id})
    if (!goal) {
      return res.status(400).json({ msg: 'No calorie goals set' })
    }
    res.json(goal)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
})

// @route   POST api/goals
// @desc    Post current users calorie goals
// @access  Private

router.post('/', auth, async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    console.log('error')
    return res.status(400).json({ errors: errors.array() })
  }

  try {
    let goal = await Goal.findOne({ user: req.user.id })

    if (goal) {
      goal = await Goal.findOneAndUpdate(
        { user: req.user.id },
        { $set: {
          user: req.user.id,
          bmr: req.body.bmr} },
        { new: true }
      )
      return res.json(goal)
    }

    //Create
    goal = new Goal({
      user: req.user.id,
      bmr: req.body.bmr,
    })
    await goal.save()
    res.json(goal)
  } 
  catch (error) {
    console.error(error.message)
    res.status(500).send('Server Error')
  }
})

module.exports = router
