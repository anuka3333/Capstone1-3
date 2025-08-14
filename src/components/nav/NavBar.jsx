import React from 'react'
import { NavLink } from 'react-router-dom'
import './nav.css'
import { useAuth0 } from '@auth0/auth0-react'

const NavBar = () => {
  const { user, isAuthenticated } = useAuth0();
  // Normalize roles from several possible claim locations
  const rawRoles = user?.['https://anukaphotos333/roles'] || user?.roles || user?.role || user?.['roles'];
  let roles = [];
  if (Array.isArray(rawRoles)) roles = rawRoles;
  else if (typeof rawRoles === 'string' && rawRoles.trim() !== '') roles = rawRoles.split(',').map(r => r.trim());
  else if (rawRoles) roles = [String(rawRoles)];
  const normalizedRoles = roles.map(r => String(r).toLowerCase());
  const isAdmin = isAuthenticated && normalizedRoles.includes('admin');
  return (
    <div className="main-nav">
      <NavLink to="/">Home</NavLink>
      <NavLink to="/about">About</NavLink>
      <div className="dropdown">
        <a href="#" style={{cursor: 'pointer'}}>Portfolio</a>
        <div className="dropdown-content">
          <NavLink to="/portraits">Portraits</NavLink>
          <NavLink to="/live_events">Live Events</NavLink>
          <NavLink to="/hospitality">Hospitality</NavLink>
        </div>
      </div>
      <NavLink to="/contact">Contact</NavLink>
      {isAdmin && <NavLink to="/albums">Albums</NavLink>}
      <NavLink to="/shop">Shop</NavLink>

        
    </div>
  )
}

export default NavBar