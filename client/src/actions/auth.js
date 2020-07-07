import React, {useContext} from 'react'
import axios from 'axios'
import setAuthToken from '../utils/setAuthToken'
import {AppContext} from '../AppContext'



//Load User
async function LoadUser() {

    const {dispatch} = useContext(AppContext)

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

  export default (LoadUser)