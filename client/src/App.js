import React, { useContext, useEffect} from 'react'
import axios from 'axios'
import Header from './layout/Header'
import SideBar from './layout/SideBar'
import Landing from './layout/Landing'
import Login from './login/Login'
import Register from './login/Register'
import MainPage from './main/MainPage'
import BMRCalc from './bmr/BMRCalc'
import TrackProgress from './main/TrackProgress'
import Footer from './layout/Footer'
import PrivacyPolicy from './main/PrivacyPolicy'
import PrivateRoute from './routing/PrivateRoute'
import DeploymentConfig from './deployment/DeploymentConfig'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { AppContext } from './AppContext'
import setAuthToken from './utils/setAuthToken'
import './App.scss'

function App() {
  const { dispatch, state } = useContext(AppContext)

  useEffect(() => {
    async function loadUser() {
      if (localStorage.token) {
        setAuthToken(localStorage.token)
      }
      try {
        const res = await axios.get(DeploymentConfig().apiUrl + 'api/auth')
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
    loadUser()
  }, [dispatch])

  const toggleBMRPage = state.toggleBMRPage ? 'display' : 'hide'

  return (
    <div>
      <Router>
        <Header />
        <div className={`${toggleBMRPage}-BMR-Calculator`}>
          <BMRCalc />
        </div>
        <div className='app-format'>
          {state.isAuthenticated && <SideBar className='sidebar' />}
          <Switch>
            <Route exact path='/' component={Landing} />
            <Route exact path='/login' component={Login} />
            <Route exact path='/register' component={Register} />
            <Route exact path='/track' component={TrackProgress} />
            <Route exact path='/privacy-policy' component={PrivacyPolicy} />
            <PrivateRoute exact path='/main' component={MainPage} />
          </Switch>
        </div>
        <Footer />
      </Router>
    </div>
  )
}

export default App
