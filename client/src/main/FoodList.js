import React, { useState, useEffect, useContext } from 'react'
import ListItem from './ListItem'
import SearchInput from './SearchInput'
import Spinner from '../layout/Spinner'
import DeploymentConfig from '../deployment/DeploymentConfig'
import { AppContext } from '../AppContext'
import axios from 'axios'

function FoodList(props) {
  const { type } = props

  const { state, dispatch, displayDate } = useContext(AppContext)

  const [mealNutrients, setMealNutrients] = useState({
    calories: 0,
    carbohydrates: 0,
    sugars: 0,
    protein: 0,
    fat: 0,
  })
  const [toggle, setToggle] = useState(true)
  const [hovered, setHovered] = useState(false)
  const meal = state.meals[type]

  const greaterThanOne = meal.length >= 1
  const toggleClassName = toggle ? 'on' : 'off'
  const deleteAll = hovered ? 'Clear List' : ''
  const showItem = greaterThanOne ? 'show-item' : ''
  const title = type.replace(/^\w/, (c) => c.toUpperCase())
  const addS = meal.length > 1 || meal.length < 1 ? 's' : ''
  const expandCollapse = toggle ? 'collapse' : 'expand'

  function checked() {
    greaterThanOne
      ? setToggle((prevState) => (prevState = !toggle))
      : setToggle(false)
  }

  async function clearList() {
    try {
      const res = await axios.delete(
        DeploymentConfig().apiUrl + 'api/meals/' + displayDate + '/' + type
      )
      dispatch({
        type: 'ADD_NUTRIENT_TOTALS',
        payload: {
          calories: -mealNutrients.calories,
          carbohydrates: -mealNutrients.carbohydrates,
          sugars: -mealNutrients.sugars,
          protein: -mealNutrients.protein,
          fat: -mealNutrients.fat,
        },
      })
      dispatch({
        type: 'UPDATE_MEALS',
        payload: res.data,
      })
      setMealNutrients({
        calories: 0,
        carbohydrates: 0,
        sugars: 0,
        protein: 0,
        fat: 0,
      })
    } catch (error) {
      dispatch({
        type: 'MEAL_ERROR',
      })
    }
  }

  function toggleListItems() {
    checked()
  }

  

  function handleChange(e) {
    const check = e.target.checked
  }

  function addMealNutrients(calories, carbohydrates, sugars, protein, fat) {
    
    setMealNutrients((prevItems) => ({
      calories: prevItems.calories + calories,
      carbohydrates: prevItems.carbohydrates + carbohydrates,
      sugars: prevItems.sugars + sugars,
      protein: prevItems.protein + protein,
      fat: prevItems.fat + fat,
    }))
  }

  useEffect(() => {
    setMealNutrients({
      calories: 0,
      carbohydrates: 0,
      sugars: 0,
      protein: 0,
      fat: 0,
    })
  }, [state.selectedDate])

  return (
    <div className='food-list'>
      <div className='meal-block-header'>
        <div className={`${showItem} delete-all`}>
          <i
            className='icon'
            onClick={clearList}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            delete_sweep
          </i>
          <p>{deleteAll}</p>
        </div>
        <h2>{title}</h2>
        <button
          className={`${showItem} expand-collapse`}
          onClick={toggleListItems}
        >
          <p>{expandCollapse}</p>
          <i className={`rotate-${toggleClassName} icon expand-icon`}>
            expand_more
          </i>
        </button>
      </div>
      <span style={{ fontSize: '1.2rem', fontWeight: '350' }}>
        {meal.length} item{addS} — {mealNutrients.calories} Calories
      </span>

      <div className={`tabs`}>
        <div className='tab'>
          <input
            className='checkbox'
            type='checkbox'
            checked={toggle}
            onChange={handleChange}
          />
          {state.loading ? (
            <Spinner />
          ) : (
            <div className='tab-content'>
              {state.meals[type].map((item, index) => (
                <ListItem
                  key={item._id}
                  index={index}
                  item={item}
                  type={type}
                  addMealNutrients={addMealNutrients}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      <SearchInput type={type} />
    </div>
  )
}

export default FoodList
