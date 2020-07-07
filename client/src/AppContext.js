import React, { useEffect, createContext, useReducer } from 'react'
import { format, addDays, subDays } from 'date-fns'
import DeploymentConfig from './deployment/DeploymentConfig'
import axios from 'axios'

const AppContext = createContext()

const AppContextProvider = ({ children }) => {
  /////////////////Reducer//////////////////////

  const initialState = {
    token: null,
    isAuthenticated: null,
    user: null,
    loading: true,
    darkMode: false,
    selectedDate: new Date(),
    toggleBMRPage: false,
    toggleCalendar: false,
    bmr: 0,
    error: {},
    meals: {
      breakfast: [],
      lunch: [],
      dinner: [],
      snacks: [],
    },
    nutrientTotals: {
      calories: 0,
      carbohydrates: 0,
      sugars: 0,
      protein: 0,
      fat: 0,
    },
  }

  const reducer = (state, action) => {
    const { type, payload } = action
    switch (type) {
      case 'USER_LOADED':
        return {
          ...state,
          isAuthenticated: true,
          loading: false,
          user: payload,
          darkMode: payload.darkMode
        }
      case 'REGISTER_SUCCESS':
      case 'LOGIN_SUCCESS':
        localStorage.setItem('token', payload.token)
        return {
          ...state,
          isAuthenticated: true,
          user: payload.user,
          token: payload.token,
        }
      case 'LOGOUT':
      case 'REGISTER_FAIL':
      case 'LOGIN_FAIL':
      case 'AUTH_ERROR':
        localStorage.removeItem('token')
        return {
          ...state,
          user: null,
          token: null,
          isAuthenticated: false,
        }
        case 'SET_SELECTED_DATE':{
          return {
            ...state,
            selectedDate: payload
          }
        }
        case 'TOGGLE_DARK_MODE': {
          return {
            ...state,
            darkMode: !state.darkMode
          }
        }
      case 'TOGGLE_BMR_PAGE':
        return {
          ...state,
          toggleBMRPage: !state.toggleBMRPage,
        }
      case 'CALENDAR_ON':
        return {
          ...state,
          toggleCalendar: true,
        }
      case 'CALENDAR_OFF':
        return {
          ...state,
          toggleCalendar: false,
        }
      case 'GET_CALORIE_GOALS':
        return {
          ...state,
          bmr: payload.bmr,
          loading: false,
        }
      case 'GET_MEALS':
        return {
          ...state,
          meals: {
            breakfast: payload.breakfast,
            lunch: payload.lunch,
            dinner: payload.dinner,
            snacks: payload.snacks,
          },
        }
      case 'ADD_MEALS':
      case 'UPDATE_MEALS':
        return {
          ...state,
          meals: payload,
          loading: false,
        }
      case 'MEALS_ERROR':
      case 'CLEAR_MEALS':
        return {
          ...state,
          meals: payload,
          loading: false,
        }
      case 'ADD_NUTRIENT_TOTALS':
        return {
          ...state,
          nutrientTotals: {
            calories: state.nutrientTotals.calories + payload.calories,
            carbohydrates:
              state.nutrientTotals.carbohydrates + payload.carbohydrates,
            sugars: state.nutrientTotals.sugars + payload.sugars,
            protein: state.nutrientTotals.protein + payload.protein,
            fat: state.nutrientTotals.fat + payload.fat,
          },
        }
      case 'RESET_NUTRIENT_TOTALS':
        return {
          ...state,
          nutrientTotals: {
            calories: 0,
            carbohydrates: 0,
            sugars: 0,
            protein: 0,
            fat: 0,
          },
        }
      default:
        return state
    }
  }

  const [state, dispatch] = useReducer(reducer, initialState)
  ///////////////End of reducer /////////////////////

  function onDateClick(day, modifiers = {}) {
    if (modifiers.disabled) {
      return
    }
    dispatch({ type: 'SET_SELECTED_DATE', payload: day })
    dispatch({ type: 'CALENDAR_OFF' })
  }

  function nextDay() {
    dispatch({ type: 'SET_SELECTED_DATE', payload: addDays(state.selectedDate, 1) })
    dispatch({ type: 'RESET_NUTRIENT_TOTALS'})
  }

  function prevDay() {
    dispatch({ type: 'SET_SELECTED_DATE', payload: subDays(state.selectedDate, 1) })
    dispatch({ type: 'RESET_NUTRIENT_TOTALS'})
  }

  const displayDate = format(state.selectedDate, 'yyyy-MM-dd')


  

  async function updateUserDarkMode() {
    try {
      await axios.patch(DeploymentConfig().apiUrl + 'api/users', {
darkMode: !state.darkMode
      })
    } catch (error) {
    }
  }

  useEffect(() => {
    if(state.darkMode) {
      document.documentElement.setAttribute('data-theme', 'dark')
    }
    else document.documentElement.setAttribute('data-theme', 'light')
  }, [state.darkMode])

  useEffect(() => {
    //Get current user's meal items
  async function getMealItems() {
    dispatch({
      type: 'CLEAR_MEALS',
      payload: {
        breakfast: [],
        lunch: [],
        dinner: [],
        snacks: [],
      },
    })
    try {
      const res = await axios.get(
        DeploymentConfig().apiUrl + 'api/meals/' + displayDate
      )
      dispatch({
        type: 'GET_MEALS',
        payload: res.data,
      })
    } catch (error) {
      dispatch({
        type: 'MEALS_ERROR',
        payload: {
          breakfast: [],
          lunch: [],
          dinner: [],
          snacks: [],
        },
      })
    }
  }

  //Get current user's profile
  async function getCalorieGoals() {
    try {
      const res = await axios.get(DeploymentConfig().apiUrl + 'api/goals')
      dispatch({
        type: 'GET_CALORIE_GOALS',
        payload: res.data,
      })
    } catch (error) {
      dispatch({
        type: 'CALORIE_GOALS_ERROR',
      })
    }
  }
  getMealItems()
  getCalorieGoals()
    dispatch({ type: 'RESET_NUTRIENT_TOTALS'})
  }, [state.selectedDate, displayDate, dispatch])

  return (
    <AppContext.Provider
      value={{
        onDateClick,
        displayDate,
        nextDay,
        prevDay,
        updateUserDarkMode,
        state,
        dispatch,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export { AppContextProvider, AppContext }
