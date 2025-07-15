import React from 'react'
import { NavLink } from 'react-router-dom'
import './nav.css'

const NavBar = () => {
  return (
    <div className="main-nav">
      <NavLink to="/">Home</NavLink>
      <NavLink to="/about">About</NavLink>
      <div className="dropdown">
        <a to="#" style={{cursor: 'pointer'}}>Portfolio</a>
        <div className="dropdown-content">
          <NavLink to="/portraits">Portraits</NavLink>
          <NavLink to="/live_events">Live Events</NavLink>
          <NavLink to="/hospitality">Hospitality</NavLink>
        </div>
      </div>
      <NavLink to="/contact">Contact</NavLink>
      <NavLink to="/shop">Shop</NavLink>

        
    </div>
  )
}

export default NavBar