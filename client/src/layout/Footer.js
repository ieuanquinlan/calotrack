import React from 'react'
import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className='navbar'>
      <div className='navbar-layout-footer'>
        <div className='navbar-footer-element'>
          <Link to='/privacy-policy' style={{ textDecoration: 'none', color: 'var(--selected-color)' }}>Privacy Policy</Link>
        </div>
        <div className='navbar-footer-element'>
          <a
            style={{ textDecoration: 'none', color: 'var(--selected-color)' }}
            href='http://ieuanquinlan.com/'
          >
            © Ieuan Quinlan 2020
          </a>
          <div>All Rights Reserved</div>
        </div>
        <div className='navbar-footer-element'>
          <div>Data collected from USDA Food Data Central</div>
          <div>All serving sizes are 100 grams</div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
