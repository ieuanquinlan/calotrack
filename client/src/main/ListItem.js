import React, { useState, useEffect, useContext } from 'react'
import { AppContext } from '../AppContext'
import DeploymentConfig from '../deployment/DeploymentConfig'
import axios from 'axios'

function ListItem({ item, index, type, addMealNutrients }) {
  const { dispatch, displayDate } = useContext(AppContext)
  const [quantityValue, setQuantityValue] = useState(item.quantity)
  const [toggle, setToggle] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [isDeleted, setIsDeleted] = useState(false)

  const iconName = hovered ? 'delete_forever' : 'delete'
  const deletedClass = isDeleted ? 'deleted-item' : ''
  const calories = parseInt(item.calories)
  const carbohydrates = parseInt(item.carbohydrates)
  const sugars = parseInt(item.sugars)
  const protein = parseInt(item.protein)
  const fat = parseInt(item.fat)


  useEffect(() => {
    dispatch({
      type: 'ADD_NUTRIENT_TOTALS',
      payload: {
        calories: calories * quantityValue,
        carbohydrates: carbohydrates * quantityValue,
        sugars: sugars * quantityValue,
        protein: protein * quantityValue,
        fat: fat * quantityValue,
      }
    })
    addMealNutrients(
      calories * quantityValue,
      carbohydrates * quantityValue,
      sugars * quantityValue,
      protein * quantityValue,
      fat * quantityValue
    )
  }, [displayDate])


  useEffect(() => {
    async function amendQuantity(mealType, mealIndex, quantity) {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      }
      try {
        await axios.patch(
          DeploymentConfig().apiUrl +
            'api/meals/' +
            displayDate +
            '/' +
            mealType +
            '/' +
            mealIndex,
          { quantity },
          config
        )
      } catch (error) {
        dispatch({
          type: 'MEAL_ERROR',
        })
      }
    }
    amendQuantity(type, index, quantityValue)
  }, [quantityValue, dispatch, displayDate, index, type])

  function handleQuantityChange(e) {
    const newTotal = e.target.value - quantityValue
    setQuantityValue(parseInt(e.target.value || 1))
    const calorieAmount = calories * newTotal
    const carbohydratesAmount = carbohydrates * newTotal
    const sugarsAmount = sugars * newTotal
    const proteinAmount = protein * newTotal
    const fatAmount = fat * newTotal
    if (newTotal !== -1 && quantityValue !== 1){
    dispatch({
      type: 'ADD_NUTRIENT_TOTALS',
      payload: {
        calories: calorieAmount,
        carbohydrates: carbohydratesAmount,
        sugars: sugarsAmount,
        protein: proteinAmount,
        fat: fatAmount,
      },
    })
    addMealNutrients(
      calorieAmount,
      carbohydratesAmount,
      sugarsAmount,
      proteinAmount,
      fatAmount
    )}
  }

  function incrementQuantity() {
    setQuantityValue((prevQty) => prevQty + 1)
    dispatch({
      type: 'ADD_NUTRIENT_TOTALS',
      payload: {
        calories: calories,
        carbohydrates: carbohydrates,
        sugars: sugars,
        protein: protein,
        fat: fat,
      },
    })
    addMealNutrients(calories, carbohydrates, sugars, protein, fat)
  }
  function decrementQuantity() {
    if (quantityValue > 1) {
      setQuantityValue((prevQty) => prevQty - 1)
      dispatch({
        type: 'ADD_NUTRIENT_TOTALS',
        payload: {
          calories: -calories,
          carbohydrates: -carbohydrates,
          sugars: -sugars,
          protein: -protein,
          fat: -fat,
        },
      })
      addMealNutrients(-calories, -carbohydrates, -sugars, -protein, -fat)
    }
  }

  function setDelete() {
    setIsDeleted(true)
  }

  async function deleteItem() {
    try {
      const res = await axios.delete(
        DeploymentConfig().apiUrl +
          'api/meals/' +
          displayDate +
          '/' +
          type +
          '/' +
          item._id
      )
      setDelete()
      addMealNutrients(
        -calories * quantityValue,
        -carbohydrates * quantityValue,
        -sugars * quantityValue,
        -protein * quantityValue,
        -fat * quantityValue
      )
      dispatch({
        type: 'ADD_NUTRIENT_TOTALS',
        payload: {
          calories: -calories * quantityValue,
          carbohydrates: -carbohydrates * quantityValue,
          sugars: -sugars * quantityValue,
          protein: -protein * quantityValue,
          fat: -fat * quantityValue,
        },
      })
      dispatch({
        type: 'UPDATE_MEALS',
        payload: res.data,
      })
    } catch (error) {
      console.log('could not post meal item')
      dispatch({
        type: 'MEAL_ERROR',
      })
    }
  }

  function checked() {
    setToggle((prevState) => (prevState = !toggle))
  }

  function handleChange(e) {
    const checked = e.target.checked
  }

  return (
    <div className={`${deletedClass} list-item`} onClick={checked}>
      <div className='list-item-component'>
        <i
          className='icon delete'
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onClick={() => deleteItem()}
        >
          {iconName}
        </i>

        <div className='item-name'>{item.name}</div>
        <ul className='list-item-right'>
          <li> {calories * quantityValue} Kcal </li>
          <li>
            <label>
              Qty:
              <input
                className='qty-box'
                type='text'
                value={quantityValue}
                onChange={handleQuantityChange}
              />
            </label>
          </li>
          <li>
            <i onClick={incrementQuantity} className='icon circle-icon green'>
              add_circle_outline
            </i>
            <i onClick={decrementQuantity} className='icon circle-icon red'>
              remove_circle_outline
            </i>
          </li>
        </ul>
      </div>
      <div className='tabs'>
        <div className='tab'>
          <input
            className='checkbox'
            type='checkbox'
            checked={toggle}
            onChange={handleChange}
          />
          <div className='tab-content'>
            <ul className='list-item-component list-item-nutrients list-text-small'>
              <li>
                <div>Carbohydrates</div>
                <div>{carbohydrates * quantityValue} g</div>
              </li>
              <li>
                <div>Sugars</div>
                <div>{sugars * quantityValue} g</div>
              </li>
              <li>
                <div>Protein</div>
                <div>{protein * quantityValue} g</div>
              </li>
              <li>
                <div>Fat</div>
                <div>{fat * quantityValue} g</div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      {toggle ? (
        <div style={{ textAlign: 'center' }}>Show Less</div>
      ) : (
        <div className='show-more'>Show More</div>
      )}
    </div>
  )
}

export default ListItem
