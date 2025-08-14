import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import NavBar from './components/nav/NavBar';
import { useAuth0 } from '@auth0/auth0-react';
import './layout.css';

const Layout = () => {
  const { loginWithRedirect, logout, isAuthenticated, user, isLoading } = useAuth0();
  const [editMode, setEditMode] = useState(false);
  const navigate = useNavigate();

  const toggleEditMode = () => setEditMode(prev => !prev);

  // Optional: Debug user object
  useEffect(() => {
    console.log('Auth0 user:', user);
  }, [user]);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <header className="header-row">
        <img src="/anuka.png" alt="Anuka Photos Banner" className="banner-img" />

        <div className="my-account-link">
          {isAuthenticated ? (
            <>
              <span>Hello, {user.name}</span>
              {/* Admin-only Edit Page button */}
              {user?.['https://anukaphotos333/roles']?.includes('admin') && (
                <button onClick={toggleEditMode} style={{ marginLeft: '10px' }}>
                  {editMode ? 'Exit Edit Mode' : 'Edit Page'}
                </button>
              )}
              {/* Logout button redirects to home */}
              <button
                onClick={() =>
                  logout({ returnTo: window.location.origin })
                }
                style={{ marginLeft: '10px' }}
              >
                Logout
              </button>
            </>
          ) : (
            <button onClick={() => loginWithRedirect()}>My Account</button>
          )}
        </div>

        <NavBar />
      </header>

      <main style={{ paddingTop: '20px' }}>
        {/* Pass editMode down to child pages */}
        <Outlet context={{ editMode }} />
      </main>
    </div>
  );
};

export default Layout;