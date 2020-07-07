import React, { useState, useEffect, useContext } from 'react'
import { AppContext } from '../AppContext'
import CaloriesGraph from './CaloriesGraph'
import CalorieAverages from './CalorieAverages'
import DayPickerInput from 'react-day-picker/DayPickerInput'
import DeploymentConfig from '../deployment/DeploymentConfig'
import { format } from 'date-fns'
import axios from 'axios'
import 'react-day-picker/lib/style.css'

function TrackProgress() {
  const { state } = useContext(AppContext)
  const [dateFrom, setDateFrom] = useState(new Date())
  const [dateTo, setDateTo] = useState(new Date())
  const [nutritionData, setNutritionData] = useState([])
  const [displayedCalorieGoal, setDisplayedCalorieGoal] = useState(state.bmr)
  const [nutritionAverage, setNutritionAverage] = useState({
    calories: 0,
    carbohydrates: 0,
    sugars: 0,
    protein: 0,
    fat: 0,
  })
  const dateFromFormatted = format(dateFrom, 'yyyy-MM-dd')
  const dateToFormatted = format(dateTo, 'yyyy-MM-dd')
  const dateFromDisplay = format(dateFrom, 'dd/MM/yyyy')
  const dateToDisplay = format(dateTo, 'dd/MM/yyyy')

  

  useEffect(() => {
    //Get current user's meal items
  async function getMeals() {
    try {
      const res = await axios.get(
        DeploymentConfig().apiUrl +
          'api/meals/' +
          dateFromFormatted +
          '/' +
          dateToFormatted
      )

      function getFields(
        data,
        breakfast,
        lunch,
        dinner,
        snacks,
        calories,
        carbohydrates,
        sugars,
        protein,
        fat,
        quantity,
        d
      ) {
        let output = []
        const reducer = (accumulator, currentValue) =>
          accumulator + currentValue
        for (let i = 0; i < data.length; ++i) {
          const breakfastCals = data[i][breakfast]
            .map((obj) => obj[calories] * obj[quantity])
            .reduce(reducer, 0)
          const lunchCals = data[i][lunch]
            .map((obj) => obj[calories] * obj[quantity])
            .reduce(reducer, 0)
          const dinnerCals = data[i][dinner]
            .map((obj) => obj[calories] * obj[quantity])
            .reduce(reducer, 0)
          const snacksCals = data[i][snacks]
            .map((obj) => obj[calories] * obj[quantity])
            .reduce(reducer, 0)
          const breakfastCarbs = data[i][breakfast]
            .map((obj) => obj[carbohydrates] * obj[quantity])
            .reduce(reducer, 0)
          const lunchCarbs = data[i][lunch]
            .map((obj) => obj[carbohydrates] * obj[quantity])
            .reduce(reducer, 0)
          const dinnerCarbs = data[i][dinner]
            .map((obj) => obj[carbohydrates] * obj[quantity])
            .reduce(reducer, 0)
          const snacksCarbs = data[i][snacks]
            .map((obj) => obj[carbohydrates] * obj[quantity])
            .reduce(reducer, 0)
          const breakfastSugars = data[i][breakfast]
            .map((obj) => obj[sugars] * obj[quantity])
            .reduce(reducer, 0)
          const lunchSugars = data[i][lunch]
            .map((obj) => obj[sugars] * obj[quantity])
            .reduce(reducer, 0)
          const dinnerSugars = data[i][dinner]
            .map((obj) => obj[sugars] * obj[quantity])
            .reduce(reducer, 0)
          const snacksSugars = data[i][snacks]
            .map((obj) => obj[sugars] * obj[quantity])
            .reduce(reducer, 0)
          const breakfastProtein = data[i][breakfast]
            .map((obj) => obj[protein] * obj[quantity])
            .reduce(reducer, 0)
          const lunchProtein = data[i][lunch]
            .map((obj) => obj[protein] * obj[quantity])
            .reduce(reducer, 0)
          const dinnerProtein = data[i][dinner]
            .map((obj) => obj[protein] * obj[quantity])
            .reduce(reducer, 0)
          const snacksProtein = data[i][snacks]
            .map((obj) => obj[protein] * obj[quantity])
            .reduce(reducer, 0)
          const breakfastFat = data[i][breakfast]
            .map((obj) => obj[fat] * obj[quantity])
            .reduce(reducer, 0)
          const lunchFat = data[i][lunch]
            .map((obj) => obj[fat] * obj[quantity])
            .reduce(reducer, 0)
          const dinnerFat = data[i][dinner]
            .map((obj) => obj[fat] * obj[quantity])
            .reduce(reducer, 0)
          const snacksFat = data[i][snacks]
            .map((obj) => obj[fat] * obj[quantity])
            .reduce(reducer, 0)
          const caloriesTotal =
            breakfastCals + lunchCals + dinnerCals + snacksCals
          const carbsTotal =
            breakfastCarbs + lunchCarbs + dinnerCarbs + snacksCarbs
          const sugarsTotal =
            breakfastSugars + lunchSugars + dinnerSugars + snacksSugars
          const proteinTotal =
            breakfastProtein + lunchProtein + dinnerProtein + snacksProtein
          const fatTotal = breakfastFat + lunchFat + dinnerFat + snacksFat
          const date = Date.parse(data[i][d])
          output.push({
            x: date,
            y: caloriesTotal,
            carbohydrates: carbsTotal,
            sugars: sugarsTotal,
            protein: proteinTotal,
            fat: fatTotal,
          })
        }
        return output.sort((a, b) => a.x - b.x)
      }
      const result = getFields(
        res.data,
        'breakfast',
        'lunch',
        'dinner',
        'snacks',
        'calories',
        'carbohydrates',
        'sugars',
        'protein',
        'fat',
        'quantity',
        'date'
      )
      setNutritionData(result)
    } catch (error) {
    }
  }
    getMeals()
  }, [dateFromFormatted, dateToFormatted])

  const FORMAT = 'MM/dd/yyyy'

  function changeHandlerFrom(day) {
    setDateFrom(day)
  }
  function changeHandlerTo(day) {
    setDateTo(day)
  }

  useEffect(() => {
    const caloriesReducer = (accumulator, currentValue) =>
      accumulator + currentValue.y
    const carbohydratesReducer = (accumulator, currentValue) =>
      accumulator + currentValue.carbohydrates
    const sugarsReducer = (accumulator, currentValue) =>
      accumulator + currentValue.sugars
    const proteinReducer = (accumulator, currentValue) =>
      accumulator + currentValue.protein
    const fatReducer = (accumulator, currentValue) =>
      accumulator + currentValue.fat
    if (nutritionData.length > 0) {
      setNutritionAverage({
        calories: parseInt(
          nutritionData.reduce(caloriesReducer, 0) / nutritionData.length
        ),
        carbohydrates: parseInt(
          nutritionData.reduce(carbohydratesReducer, 0) / nutritionData.length
        ),
        sugars: parseInt(
          nutritionData.reduce(sugarsReducer, 0) / nutritionData.length
        ),
        protein: parseInt(
          nutritionData.reduce(proteinReducer, 0) / nutritionData.length
        ),
        fat: parseInt(
          nutritionData.reduce(fatReducer, 0) / nutritionData.length
        ),
      })
    }
  }, [nutritionData])

  function displayedCalories(cals) {
    setDisplayedCalorieGoal(parseInt(cals))
  }

  function handleChange(event) {
    setDisplayedCalorieGoal(event.target.value)
  }

  useEffect(() => {
    setDisplayedCalorieGoal(state.bmr)
  }, [state.bmr])

  useEffect(() => {
    displayedCalories(displayedCalorieGoal)
  }, [displayedCalorieGoal])

  return (
    <div className='track-progress'>
      <div className='day-picker-layout'>
        <div className='day-picker-input'>
          From:{' '}
          <DayPickerInput
          placeholder='From'
            format={FORMAT}
            day={dateFrom}
            onDayChange={changeHandlerFrom}
            dayPickerProps ={{
              disabledDays: {
                after: new Date()
              }
            }}
            
          />
          to:{' '}
          <DayPickerInput
          placeholder='To'
            format={FORMAT}
            day={dateTo}
            onDayChange={changeHandlerTo}
            dayPickerProps ={{
              disabledDays: {
                before: dateFrom,
                after: new Date()
              }
            }}
          />
        </div>
        <div className='day-picker-input'>
          <label>
            Calorie Intake Goal:
            <select value={displayedCalorieGoal} onChange={handleChange}>
              <option value={state.bmr}>Maintenance</option>
              <option value={parseInt(state.bmr * 0.8)}>Weight Loss</option>
              <option value={parseInt(state.bmr * 1.2)}>Weight Gain</option>
            </select>
          </label>
          <div>{displayedCalorieGoal} Kcal</div>
        </div>
      </div>
      <div className='page-layout'>
        <div className='component-column page-block'>
          <CaloriesGraph
            nutritionData={nutritionData}
            displayedCalorieGoal={displayedCalorieGoal}
          />
        </div>
        <div className='component-column page-block'>
          <CalorieAverages
            displayedCalories={displayedCalories}
            displayedCalorieGoal={displayedCalorieGoal}
            nutritionAverage={nutritionAverage}
            dateFrom={dateFromDisplay}
            dateTo={dateToDisplay}
          />
        </div>
      </div>
    </div>
  )
}

export default TrackProgress
