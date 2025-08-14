import React from 'react';
import { createRoot } from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react';
import App from './App';

const root = createRoot(document.getElementById('root'));

root.render(
 <Auth0Provider
  domain="dev-55c77278fugt2tdp.us.auth0.com"
  clientId="Cna1GrUudUJoDb05ByvSQF3YA3was4IG"
  authorizationParams={{ redirect_uri: window.location.origin }}
>
  <App />
</Auth0Provider>)