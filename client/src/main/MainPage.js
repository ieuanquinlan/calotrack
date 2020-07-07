import React, { useContext } from 'react'
import CalorieCounter from './CalorieCounter'
import FoodList from './FoodList'
import { AppContext } from '../AppContext'
import { format } from 'date-fns'

function MainPage() {
  const {
    state,
    nextDay,
    prevDay
  } = useContext(AppContext)


  const dateFormat = 'do MMMM yyyy'
  const formattedDate = format(state.selectedDate, dateFormat)
  const todaysDate = format(new Date(), dateFormat)

  return (
    <div className='main'>
      <h3 className='date-element'>
        <i className='icon chevron' onClick={prevDay}>
          chevron_left
        </i>
        <div>{formattedDate}</div>
        {formattedDate === todaysDate ? (
          ''
        ) : (
          <i className='icon' onClick={nextDay}>
            chevron_right
          </i>
        )}
      </h3>
      <div className='page-layout'>
        <div className='component-column block-1'>
          <CalorieCounter />
        </div>
        <div className='component-column block-2'>
          <FoodList type='breakfast' />
          <FoodList type='lunch' />
          <FoodList type='dinner' />
          <FoodList type='snacks' />
        </div>
      </div>
    </div>
  )
}

export default MainPage
