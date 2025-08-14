import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const ProtectedRoute = ({ children, roles }) => {
  const { isAuthenticated, user, loginWithRedirect } = useAuth0();

  if (!isAuthenticated) {
    loginWithRedirect();
    return null;
  }

  // check for role if roles are specified
  if (roles && !roles.some(role => user?.['https://anukaphotos333/roles']?.includes(role))) {
    return <p>Access Denied</p>;
  }

  return children;
};

export default ProtectedRoute;