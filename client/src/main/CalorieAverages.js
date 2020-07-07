import React from 'react'

function CalorieAverages({
  displayedCalorieGoal,
  nutritionAverage,
  dateFrom,
  dateTo,
}) {
  return (
    <div className='calories'>
      <h2 className='calories-title'>
        Nutritional Averages for {dateFrom} - {dateTo}
      </h2>
      <div className='calories-breakdown'>
        <section>
          <div className='grid-container'>
            <div className='grid-header'>
              <h3>Calories</h3>
              <p>
                Average of <strong>{nutritionAverage.calories} Kcal</strong> of{' '}
                <strong>{displayedCalorieGoal} Kcal</strong> goal
              </p>
            </div>
            <hr />
            <div className='nutrients-grid'>
              <div className='grid-cell'>Carbohydrates</div>
              <div className='grid-cell'>
                {nutritionAverage.carbohydrates} g
              </div>
              <div className='grid-cell'>Sugars</div>
              <div className='grid-cell'>{nutritionAverage.sugars} g</div>
              <div className='grid-cell'>Protein</div>
              <div className='grid-cell'>{nutritionAverage.protein} g</div>
              <div className='grid-cell'>Fat</div>
              <div className='grid-cell'>{nutritionAverage.fat} g</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default CalorieAverages
