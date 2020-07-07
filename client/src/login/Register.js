import React, { useState, useContext } from 'react'
import { Link, Redirect } from 'react-router-dom'
import { AppContext } from '../AppContext'
import axios from 'axios'
import setAuthToken from '../utils/setAuthToken'

const Register = () => {
  const { state, dispatch } = useContext(AppContext)

  const [formData, setformData] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
  })

  const { name, email, password, password2 } = formData

  function onChange(e) {
    setformData({ ...formData, [e.target.name]: e.target.value })
  }
  //Load User
  async function loadUser() {
    if (localStorage.token) {
      setAuthToken(localStorage.token)
    }
    try {
      const res = await axios.get('http://localhost:5000/api/auth')
      dispatch({
        type: 'USER_LOADED',
        payload: res.data,
      })
    } catch (error) {
      dispatch({
        type: 'AUTH_ERROR',
      })
    }
  }

  //Register User
  async function register({ name, email, password }) {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    }
    const body = JSON.stringify({ name, email, password })

    try {
      const res = await axios.post('http://localhost:5000/api/users', body, config)
      dispatch({
        type: 'REGISTER_SUCCESS',
        payload: res.data,
      })
      dispatch(loadUser())
    } catch (error) {
      dispatch({
        type: 'REGISTER_FAIL',
      })
    }
  }
  async function onSubmit(e) {
    e.preventDefault()
    password === password2 && register({ name, email, password })
  }

  if (state.isAuthenticated) {
    return <Redirect to='/main' />
  }

  return (
    <div className="landing">
      <h1>Sign Up</h1>
      <p className=''>
        <i className='icon'>account_circle</i> Create Your Account
      </p>
      <form className='landing-form' onSubmit={(e) => onSubmit(e)}>
        <div className='landing-form-elements-register'>
          <input
            type='text'
            placeholder='Name'
            name='name'
            value={name}
            onChange={(e) => onChange(e)}
          />
          <input
            type='email'
            placeholder='Email Address'
            name='email'
            value={email}
            onChange={(e) => onChange(e)}
          />
          <input
            type='password'
            placeholder='Password'
            name='password'
            value={password}
            onChange={(e) => onChange(e)}
          />
          <input
            type='password'
            placeholder='Confirm Password'
            name='password2'
            value={password2}
            onChange={(e) => onChange(e)}
          />
        </div>
        <input type='submit' className='landing-button' value='Register' />
      </form>
      <p >
        Already have an account? <Link to='/login'>Sign In</Link>
      </p>
    </div>
  )
}
export default Register
