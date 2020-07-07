import React, { Fragment, useContext } from 'react'
import {AppContext} from '../AppContext'
import EllipseDarkMode from '../assets/EllipseDarkMode'
import EllipseLightMode from '../assets/EllipseLightMode'

function ProgressRing({
  radius,
  stroke,
  progress,
  strokeColor,
  circlePos,
  goal,
}) {

  const {state} = useContext(AppContext)

  const normalizedRadius = radius - stroke * 2
  const circumference = normalizedRadius * 2 * Math.PI

  const strokeDashoffset = circumference - (progress / 100) * circumference

  return (
    <Fragment>
      {state.darkMode ? 
    <EllipseDarkMode radius={radius} normalizedRadius={normalizedRadius} circumference={circumference} stroke={stroke} strokeDashoffset={strokeDashoffset} progress={progress} strokeColor={strokeColor} circlePos={circlePos} goal={goal}/> :
      <EllipseLightMode radius={radius} normalizedRadius={normalizedRadius} circumference={circumference} stroke={stroke} strokeDashoffset={strokeDashoffset} progress={progress} strokeColor={strokeColor} circlePos={circlePos} goal={goal}/>
      }
    </Fragment>
  )
}

export default ProgressRing
