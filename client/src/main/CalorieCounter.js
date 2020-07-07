import React, { useState, useEffect, useContext } from 'react'
import ProgressRing from './ProgressRing'
import { AppContext } from '../AppContext'

function CalorieCounter() {
  const { state } = useContext(AppContext)

  const [progress, setProgress] = useState(0)
  const [circleColor, setCircleColor] = useState('url(#gradient1)')
  const [textColor, setTextColor] = useState('')
  const [displayedCalorieGoal, setDisplayedCalorieGoal] = useState(state.bmr)

  let caloriesRemaining = parseInt(displayedCalorieGoal - state.nutrientTotals.calories)
  const caloriePercentage = displayedCalorieGoal === 0 ? 0 : Math.round(
    100 - (caloriesRemaining * 100) / displayedCalorieGoal
  )

  function handleChange(event) {
    setDisplayedCalorieGoal(event.target.value)
  }

  useEffect(() => {
    if (caloriePercentage < 100) {
      setProgress(caloriePercentage)
      setCircleColor('url(#gradient1)')
      setTextColor('')
    } else {
      setProgress(100)
      setCircleColor('url(#gradient2)')
      setTextColor('red')
    }
  }, [displayedCalorieGoal, state.nutrientTotals, caloriePercentage])

  useEffect(() => {
    setDisplayedCalorieGoal(state.bmr)
  }, [state.bmr])

  return (
    <div className='calories'>
      <h2 className='calories-title'>Daily Totals</h2>
      <div className='calories-breakdown'>
        <section>
          <h3 className='header-type-bold'>Calories Goal</h3>
          <div>{displayedCalorieGoal} Kcal</div>
          <label>
            Goal:
            <select value={displayedCalorieGoal} onChange={handleChange}>
              <option value={state.bmr}>Maintenance</option>
              <option value={parseInt(state.bmr * 0.8)}>Weight Loss</option>
              <option value={parseInt(state.bmr * 1.2)}>Weight Gain</option>
            </select>
          </label>
        </section>
        <section>
          <ul>
            <li>
              <h3>Calories Consumed</h3>
              <p>{state.nutrientTotals.calories} Kcal</p>
            </li>
            <li>
              <h3>Carbohydrates</h3>
              <p>{state.nutrientTotals.carbohydrates} g</p>
              <div className='list-text-small'>
                <h3>Sugars</h3>
                <div>{state.nutrientTotals.sugars} g</div>
              </div>
            </li>
            <li>
              <h3>Protein</h3>
              <p>{state.nutrientTotals.protein} g</p>
            </li>
            <li>
              <h3>Fat</h3>
              <p>{state.nutrientTotals.fat} g</p>
            </li>
          </ul>
        </section>
        <section className={`${textColor} calories-remaining`}>
          <div>
            <h3>Calories Remaining</h3>
  <p>{caloriesRemaining < 0 ? Math.abs(caloriesRemaining) + ' Kcal over goal' : caloriesRemaining + ' Kcal'}</p>
          </div>
          <div>
            <ProgressRing
              radius={60}
              stroke={10}
              progress={progress}
              strokeColor={`${circleColor}`}
              circlePos={100}
              goal={caloriePercentage}
            />
          </div>
        </section>
      </div>
    </div>
  )
}

export default CalorieCounter
