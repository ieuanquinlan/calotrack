import React, { Fragment, useContext } from 'react'
import { AppContext } from '../AppContext'

function Header() {
  const { state, dispatch, updateUserDarkMode } = useContext(AppContext)

  //Logout - Clear profile
  function logout() {
    dispatch({ type: 'CLEAR_PROFILE' })
    dispatch({ type: 'LOGOUT' })
  }

  return (
    <Fragment>
      {state.user ? (
        <section className='navbar'>
          <div className='navbar-layout'>
            <div className='dark-mode-toggle'>
              <input type='checkbox' id='switch' defaultChecked={state.darkMode ? true : false}
              onClick={() => {
                dispatch({ type: 'TOGGLE_DARK_MODE' })
                updateUserDarkMode()
              }}/>
              <label htmlFor='switch'>Toggle</label>
            </div>

            <h1>
              Calotrack
            </h1>
            <div className='navbar-textbox'>
              <h4>Welcome, {state.user.name}</h4>
              <div>
                <a
                  style={{
                    textDecoration: 'none',
                    color: 'var(--selected-color)',
                  }}
                  onClick={logout}
                  href='/'
                >
                  <i className='icon'>login</i> <span>Logout</span>
                </a>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className='navbar header'>
          <h1 className='navbar-textbox'>Calotrack</h1>
        </section>
      )}
    </Fragment>
  )
}

export default Header
