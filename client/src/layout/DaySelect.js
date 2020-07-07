import React, { Fragment, useContext } from 'react'
import {AppContext} from '../AppContext'
import DayPicker from 'react-day-picker'
import 'react-day-picker/lib/style.css'

function DaySelect () {

const {state, onDateClick} = useContext(AppContext)


    return (
<Fragment>
    <DayPicker 
    keepFocus={false}
    selectedDays={state.selectedDate}
    onDayClick={onDateClick}
    disabledDays={[
        {
          after: new Date()
        }
      ]}/>
    
</Fragment>
    )
}

export default DaySelect