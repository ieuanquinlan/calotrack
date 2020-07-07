import React, { useState, useEffect, useContext } from 'react'
import { AppContext } from '../AppContext'
import axios from 'axios'

function BMRCalc() {
  const [formState, setFormState] = useState({
    heightCm: '',
    heightFt: '',
    heightInch: '',
    weightKg: '',
    weightStn: '',
    weightLbs: '',
    age: '',
    sex: '',
    activityLevel: '',
  })

  const { dispatch } = useContext(AppContext)

  const [heightInCM, setHeightInCM] = useState(true)
  const [weightInKG, setWeightInKG] = useState(true)
  const [activityLevel, setActivityLevel] = useState(0)
  const [BMRValue, setBMRValue] = useState(0)

  const heightCMFoot = heightInCM ? 'Switch to feet' : 'Switch to Centimetres'
  const weightKGStn = weightInKG ? 'Switch to stone' : 'Switch to Kilograms'

  function handleChange(event) {
    const { name, value } = event.target
    setFormState((prevState) => ({ ...prevState, [name]: value }))
  }

  useEffect(() => {
    const height = heightInCM
      ? formState.heightCm
      : formState.heightInch / 12 + parseInt(formState.heightFt) * 30.48
    const weight = weightInKG
      ? formState.weightKg
      : (formState.weightLbs / 14 + parseInt(formState.weightStn)) * 6.335

    if (formState.activityLevel === 'inactive') {
      setActivityLevel(1.2)
    } else if (formState.activityLevel === 'moderate') {
      setActivityLevel(1.55)
    } else if (formState.activityLevel === 'active') {
      setActivityLevel(1.725)
    }
    if (formState.sex === 'male') {
      setBMRValue(
        parseInt(
          (66.47 + 13.75 * weight + 5.003 * height - 6.755 * formState.age) *
            activityLevel
        )
      )
    } else {
      setBMRValue(
        parseInt(
          655.1 + 9.563 * weight + 1.85 * height - 4.676 * formState.age
        ) * activityLevel
      )
    }
  }, [formState, activityLevel, heightInCM, weightInKG])

  //Create or update profile
async function createCalorieGoals (BMRValue) {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    }
    const res = await axios.post('http://localhost:5000/api/goals', {bmr: BMRValue}, config)
    dispatch({
      type: 'GET_CALORIE_GOALS',
      payload: res.data,
    })
  } catch (error) {
    dispatch({
      type: 'PROFILE_ERROR'
    })
  }
}

function calculateBMR() {
  createCalorieGoals(BMRValue)
  dispatch({ type: 'TOGGLE_BMR_PAGE' })
}

  const heightInput = heightInCM ? (
    <div>
      <label>
        Centimetres
        <input
          className='form-input'
          value={formState.heightCm}
          name='heightCm'
          onChange={handleChange}
        />
      </label>
    </div>
  ) : (
    <div>
      <label>
        Feet
        <input
          className='form-input'
          value={formState.heightFt}
          name='heightFt'
          onChange={handleChange}
        />
      </label>
      <label>
        Inches
        <input
          className='form-input'
          value={formState.heightInch}
          name='heightInch'
          onChange={handleChange}
        />
      </label>
    </div>
  )

  const weightInput = weightInKG ? (
    <div>
      <label>
        Kilograms
        <input
          className='form-input'
          value={formState.weightKg}
          name='weightKg'
          onChange={handleChange}
        />
      </label>
    </div>
  ) : (
    <div>
      <label>
        Stone
        <input
          className='form-input'
          value={formState.weightStn}
          name='weightStn'
          onChange={handleChange}
        />
      </label>
      <label>
        Pounds
        <input
          className='form-input'
          value={formState.weightLbs}
          name='weightLbs'
          onChange={handleChange}
        />
      </label>
    </div>
  )

  function handleSubmit(event) {
    event.preventDefault()
  }

  return (
    <div className='BMR-Calculator'>
      <div className='meal-block-header'>
        <div></div>
        <h2 className='form-title'>My Calorie Goal Calculator</h2>
        <i
          className='icon'
          onClick={() => {
            dispatch({ type: 'TOGGLE_BMR_PAGE' })
          }}
        >
          close
        </i>
      </div>
      <form className='form' onSubmit={handleSubmit}>
        <div className='form-element-column'>
          <h3>Height</h3>
          {heightInput}
          <button
            className='form-switch'
            onClick={() =>
              setHeightInCM((prevState) => (prevState = !heightInCM))
            }
          >
            {heightCMFoot}
          </button>
        </div>
        <hr className='form-spacer' />
        <div className='form-element-column'>
          <h3>Weight</h3>
          {weightInput}
          <button
            className='form-switch'
            onClick={() =>
              setWeightInKG((prevState) => (prevState = !weightInKG))
            }
          >
            {weightKGStn}
          </button>
        </div>
        <hr className='form-spacer' />
        <div className='form-element-column'>
          <label>
            <h3>Age</h3>
            <input
              className='form-input'
              name='age'
              value={formState.age}
              onChange={handleChange}
            />
          </label>
        </div>
        <hr className='form-spacer' />
        <div className='form-element-column'>
          <h3>Sex</h3>
          <label>
            <input
              type='radio'
              name='sex'
              value='male'
              onChange={handleChange}
            />{' '}
            Male
          </label>
          <br />
          <label>
            <input
              type='radio'
              name='sex'
              value='female'
              onChange={handleChange}
            />{' '}
            Female
          </label>
        </div>
        <hr className='form-spacer' />
        <div className='form-element-column'>
          <h3>Activity Level</h3>
          <label>
            <input
              type='radio'
              name='activityLevel'
              value='inactive'
              onChange={handleChange}
            />{' '}
            Inactive
          </label>
          <br />
          <label>
            <input
              type='radio'
              name='activityLevel'
              value='moderate'
              onChange={handleChange}
            />{' '}
            Moderately Active
          </label>
          <br />
          <label>
            <input
              type='radio'
              name='activityLevel'
              value='active'
              onChange={handleChange}
            />{' '}
            Active
          </label>
        </div>
        <button
          className='submit-button'
          onClick={() => {
            calculateBMR(formState.activityLevel)
          }}
        >
          Calculate Calorie Goal
        </button>
      </form>
    </div>
  )
}

export default BMRCalc
