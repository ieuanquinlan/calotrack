const express = require('express')
const router = express.Router()
const fetch = require('node-fetch')
const config = require('config')
const uri = config.get('usdaURI')


// @route   Get api/meals/:date
// @desc    Get meal by date
// @access  Private

router.get('/:food', async (req, res) => {
  const food = req.params.food
  const apiUrl = uri + food 
  try {
    const fetchResponse = await fetch(apiUrl)
    const json = await fetchResponse.json()
    res.json(json)
  } catch (error) {
    console.error(error.message)
    res.status(500).send('Server error')
  }
})

module.exports = router
