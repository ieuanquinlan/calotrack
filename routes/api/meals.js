const express = require('express')
const router = express.Router()
const { validationResult } = require('express-validator')
const auth = require('../../middleware/auth')
const Meal = require('../../models/Meal')
const User = require('../../models/User')

router.post('/:date/:meal', auth, async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  try {
    await User.findById(req.user.id).select('-password')
    const existingEntry = await Meal.findOne({
      date: req.params.date,
      user: req.user.id,
    })
    if (!existingEntry) {
      const meal = req.params.meal
      const newMeal = new Meal({
        user: req.user.id,
        [meal]: req.body[meal],
        date: new Date(req.params.date).toISOString(),
      })

      const mealData = await newMeal.save()

      res.json(mealData)
    } else {
      const meal = req.params.meal

      await Meal.updateOne(
        { date: req.params.date, user: req.user.id },
        { $push: { [meal]: req.body[meal] } }
      )
      const updatedMeal = await Meal.findOne({
        date: req.params.date,
        user: req.user.id,
      })

      res.json(updatedMeal)
    }
  } catch (error) {
    console.error(error.message)
    res.status(500).send('Server error')
  }
})

// @route   Get api/meals/:date
// @desc    Get meal by date
// @access  Private

router.get('/:date', auth, async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
  try {
    const meal = await Meal.findOne({
      date: req.params.date,
      user: req.user.id,
    })
    if (!meal) {
      return res.status(404).json({ msg: 'Meal not found' })
    }
    res.json(meal)
  } catch (error) {
    console.error(error.message)
    if (error.kind === 'ObjectId') {
      return res.status(404).send('Meal not found')
    }
    res.status(500).send('Server error')
  }
})

// @route   Get api/meals/:date1/:date2
// @desc    Get meal by date
// @access  Private

router.get('/:date1/:date2', auth, async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
  try {
    const date1 = new Date(req.params.date1).toISOString()
    const date2 = new Date(req.params.date2).toISOString()
    const meal = await Meal.find({
      user: req.user.id,
      date: {
            $gte: date1,
            $lte: date2
        }
    })
    if (!meal) {
      return res.status(404).json({ msg: 'Meal not found' })
    }
    
    res.json(meal)
  } catch (error) {
    console.error(error.message)
    if (error.kind === 'ObjectId') {
      return res.status(404).send('Meal not found')
    }
    res.status(500).send('Server error')
  }
})

// @route   PATCH api/:date/:meal/:index
// @desc    Update quantities
// @access  Private
router.patch('/:date/:meal/:index', auth, async (req, res) => {
  try {
    const mealType = req.params.meal
    const mealIndex = req.params.index
    const existingEntry = await Meal.findOne({
      date: req.params.date,
      user: req.user.id,
    })
    if (!existingEntry) {
      return res.status(404).json({ msg: 'Meal not found' })
    } else {
      const updatedMeal = await Meal.updateOne(
        { date: req.params.date, user: req.user.id },
        {
          $set: {
            [mealType + '.' + mealIndex + '.' + 'quantity']: req.body.quantity,
          },
        }
      )

      res.json(updatedMeal)
    }
  } catch (error) {
    console.error(error.message)
    res.status(500).send('Server error')
  }
})

// @route   DELETE api/:date/:meal/:id
// @desc    Delete meal item
// @access  Private
router.delete('/:date/:meal/:id', auth, async (req, res) => {
  try {
    const mealType = req.params.meal
    const mealId = req.params.id
    const existingEntry = await Meal.findOne({
      date: req.params.date,
      user: req.user.id,
    })
    if (!existingEntry) {
      return res.status(404).json({ msg: 'Meal not found' })
    } else {
      await Meal.updateOne(
        { date: req.params.date, user: req.user.id },
        { $pull: { [mealType]: { _id: mealId } } }
      )

      const updatedMeal = await Meal.findOne({
        date: req.params.date,
        user: req.user.id,
      })

      res.json(updatedMeal)
    }
  } catch (error) {
    console.error(error.message)
    res.status(500).send('Server error')
  }
})

// @route   DELETE api/:date/:meal
// @desc    Delete meal item
// @access  Private
router.delete('/:date/:meal', auth, async (req, res) => {
  try {
    const mealType = req.params.meal
    const existingEntry = await Meal.findOne({
      date: req.params.date,
      user: req.user.id,
    })
    if (!existingEntry) {
      return res.status(404).json({ msg: 'Meal not found' })
    } else {
      await Meal.updateOne(
        { date: req.params.date, user: req.user.id },
        { $set: { [mealType]: [] } },
        { multi: true }
      )

      const updatedMeal = await Meal.findOne({
        date: req.params.date,
        user: req.user.id,
      })

      res.json(updatedMeal)
    }
  } catch (error) {
    console.error(error.message)
    res.status(500).send('Server error')
  }
})

module.exports = router
