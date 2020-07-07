const mongoose = require('mongoose')
const Schema = mongoose.Schema

const MealSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users',
      },
    breakfast: [{
        name: {
            type: String
        },
        calories: {
            type: Number,
            required: true
        },
        carbohydrates: {
            type: Number,
            required: true
        },
        sugars: {
            type: Number,
            required: true
        },
        protein: {
            type: Number,
            required: true
        },
        fat: {
            type: Number,
            required: true
        },
        quantity: {
            type: Number,
            required: true
        }
    }],
    lunch: [{
        name: {
            type: String
        },
        calories: {
            type: Number,
            required: true
        },
        carbohydrates: {
            type: Number,
            required: true
        },
        sugars: {
            type: Number,
            required: true
        },
        protein: {
            type: Number,
            required: true
        },
        fat: {
            type: Number,
            required: true
        },
        quantity: {
            type: Number
        }
    }],
    dinner: [{
        name: {
            type: String
        },
        calories: {
            type: Number,
            required: true
        },
        carbohydrates: {
            type: Number,
            required: true
        },
        sugars: {
            type: Number,
            required: true
        },
        protein: {
            type: Number,
            required: true
        },
        fat: {
            type: Number,
            required: true
        },
        quantity: {
            type: Number
        }
    }],
    snacks: [{
        name: {
            type: String
        },
        calories: {
            type: Number,
            required: true
        },
        carbohydrates: {
            type: Number,
            required: true
        },
        sugars: {
            type: Number,
            required: true
        },
        protein: {
            type: Number,
            required: true
        },
        fat: {
            type: Number,
            required: true
        },
        quantity: {
            type: Number
        }
    }],
  date: {
    type: Date,
    default: Date.now
  },
})

module.exports = Meal = mongoose.model('meal', MealSchema)