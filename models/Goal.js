const mongoose = require('mongoose')
const GoalSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
      },
    bmr: {
        type: Number,
        required: true
    }
})

module.exports = Goal = mongoose.model('goal', GoalSchema)