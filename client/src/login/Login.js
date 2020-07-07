import React, {useState, useContext} from "react"
import {AppContext} from '../AppContext'
import {Redirect, Link} from 'react-router-dom'
import axios from 'axios'
import setAuthToken from '../utils/setAuthToken'

export const Login = () => {

  const {state, dispatch} = useContext(AppContext);


const [formData, setFormData] = useState({
  email: "",
  password: "",
});

const { email, password} = formData

const handleInputChange = event => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });
  };

  //Load User
async function loadUser () {
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

async function login (email, password) {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    }
    const body = JSON.stringify({ email, password })
  
    try {
      const res = await axios.post('http://localhost:5000/api/auth', body, config)
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: res.data
      })
      dispatch(loadUser())
    } catch (error) {
      dispatch({
        type: 'LOGIN_FAIL'
      })
    }
  }

async function handleFormSubmit (event) {
    event.preventDefault();
    login(email, password)
  }
  

  //Redirect if logged in
  if (state.isAuthenticated) {
    return <Redirect to='/main'/>
  }

  return (
    <div className="landing">
      
      <h1>Login</h1>
          <form className="landing-form" onSubmit={handleFormSubmit}>
          
            <div className='landing-form-elements-login'>
			<label htmlFor="email">
              Email Address {' '}
              <input
                type="text"
                value={email}
                onChange={handleInputChange}
                name="email"
                id="email"
              />
            </label>

			<label htmlFor="password">
              Password {' '}
              <input
                type="password"
                value={password}
                onChange={handleInputChange}
                name="password"
                id="password"
              />
            </label>
            </div>

			{state.error && (
              <span className="form-error"></span>
            )}

           <button className='landing-button' disabled={state.loading}>
              {state.loading ? (
                "Loading..."
              ) : (
                "Login"
              )}
            </button>
          </form>
            <p>Don't have an account? Create one <Link to='/register'>here</Link></p>
        </div>
  );
};
export default Login;