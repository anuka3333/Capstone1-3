import React from 'react';
import NavBar from './components/nav/NavBar';
import { Outlet, NavLink } from 'react-router-dom';
import './layout.css';

const Layout = () => (
  <div>
    <header className="header-row">
      <img src="/anuka.png" alt="Anuka Photos Banner" className="banner-img" />
      <NavLink to="/my-account" className="my-account-link">
        My Account
      </NavLink>
    </header>

    <NavBar />

    {/* Add padding-top so content starts below fixed nav/header */}
    <main style={{ paddingTop: '120px' }}>
      <Outlet />
    </main>
  </div>
);

export default Layout;