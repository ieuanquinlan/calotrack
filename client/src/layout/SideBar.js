import React, { useContext, useRef, useEffect, useCallback } from 'react'
import { AppContext } from '../AppContext'
import { Link, useLocation } from 'react-router-dom'
import DaySelect from './DaySelect'

function SideBar() {
  const { state, dispatch } = useContext(AppContext)
  const wrapperRef = useRef(null)

  const location = useLocation()

  const handleClickOutside = useCallback((event) => {
    if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
      document.removeEventListener('click', handleClickOutside, true)
      dispatch({ type: 'CALENDAR_OFF' })
    }
  }, [wrapperRef, dispatch])

  useEffect(() => {
    if (state.toggleCalendar){
    document.addEventListener('click', handleClickOutside, true)}
  }, [state.toggleCalendar, handleClickOutside])

  

  
  const dayButton =
    location.pathname === '/main' ? 'day-button-selected' : 'menu-button'
  const trackButton =
    location.pathname === '/track' ? 'track-button-selected' : 'menu-button'
  const toggleCalendar = state.toggleCalendar ? 'display' : 'hide'

  return (
    <div className='sidebar'>
      <button
        className={`${dayButton}`}
        onClick={() => {
          dispatch({ type: 'CALENDAR_ON' })
        }}
      >
        <span>
          <i className='icon'>calendar_today</i> Meal Log
        </span>
      </button>
      <div className={`${toggleCalendar}-Calendar`} ref={wrapperRef}>
        <Link to='/main' style={{ color: '#3f3f3f' }} >
          <DaySelect />
        </Link>
      </div>
      <button
        className='menu-button'
        onClick={() => {
          dispatch({ type: 'TOGGLE_BMR_PAGE' })
        }}
      >
        <span>
          <i className='icon'>track_changes</i> Set Calorie Goals
        </span>
      </button>
      
        <Link to='/track' style={{ textDecoration: 'none', color: 'inherit' }} onClick={()=>{dispatch({ type: 'RESET_NUTRIENT_TOTALS' })}}>
        <button className={`${trackButton}`}>
          <span>
            <i className='icon'>show_chart</i> Track Progress
          </span>
        </button>
        </Link>
    </div>
  )
}

export default SideBar
