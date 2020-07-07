import React, { useContext } from 'react'
import { AppContext } from '../AppContext'
import DeploymentConfig from '../deployment/DeploymentConfig'
import axios from 'axios'

function SearchSuggestion({ item, type, resetSearch }) {
  const { dispatch, displayDate } = useContext(AppContext)

  const calories = item.foodNutrients.find(
    ({ nutrientName }) => nutrientName === 'Energy'
  )
  const carbohydrates = item.foodNutrients.find(
    ({ nutrientName }) => nutrientName === 'Carbohydrate, by difference'
  )
  const sugars = item.foodNutrients.find(
    ({ nutrientName }) => nutrientName === 'Sugars, total including NLEA'
  )
  const protein = item.foodNutrients.find(
    ({ nutrientName }) => nutrientName === 'Protein'
  )
  const fat = item.foodNutrients.find(
    ({ nutrientName }) => nutrientName === 'Total lipid (fat)'
  )

  const itemBrandOwner =
    item.brandOwner === undefined ? '' : ` - ${item.brandOwner}`
  const itemName =
    item.description.replace(
      /\S*/g,
      (word) => word.charAt(0) + word.slice(1).toLowerCase()
    ) + itemBrandOwner

  //Add Meal item
  async function addMealItem(type, item) {
    resetSearch()
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    }
    try {
      const res = await axios.post(
        DeploymentConfig().apiUrl + 'api/meals/' + displayDate + '/' + type,
        {
          breakfast: [],
          lunch: [],
          dinner: [],
          snacks: [],
          [type]: {
            name: itemName,
            calories: calories === undefined ? 0 : calories.value,
            carbohydrates:
              carbohydrates === undefined ? 0 : carbohydrates.value,
            sugars: sugars === undefined ? 0 : sugars.value,
            protein: protein === undefined ? 0 : protein.value,
            fat: fat === undefined ? 0 : fat.value,
            quantity: 1,
          },
        },
        config
      )
      dispatch({
        type: 'ADD_MEALS',
        payload: res.data,
      })
    } catch (error) {
      dispatch({
        type: 'MEAL_ERROR',
      })
    }
  }

  return (
    <div type={type} className='search-suggestion'>
      <li onClick={() => addMealItem(type, item)}>
        {itemName} — {calories ? calories.value : 0} Kcal
      </li>
    </div>
  )
}

export default SearchSuggestion
