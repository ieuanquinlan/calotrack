import React, { useContext } from 'react'
import { Link, Redirect } from 'react-router-dom'
import { AppContext } from '../AppContext'

function Landing() {
  const { state } = useContext(AppContext)

  if (state.isAuthenticated) return <Redirect to='/main' />

  return (
    <section className='landing'>
      <p>
        Welcome to Calotrack, log your daily calorie and nutritional intake and
        set your nutritional goals
      </p>
        <Link to='register' ><button className='landing-button'>Sign Up</button></Link>
        <Link to='login' ><button className='landing-button'>Login</button></Link>
    </section>
  )
}

export default Landing
