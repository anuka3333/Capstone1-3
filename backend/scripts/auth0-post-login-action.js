/**
 * Auth0 Post-Login Action script: POST new user to backend to ensure server-side record exists
 * Paste this into an Auth0 Post-Login Action
 */
exports.onExecutePostLogin = async (event, api) => {
  const fetch = require('node-fetch');
  const backend = process.env.BACKEND_URL || 'https://your-backend.example.com';
  try {
    await fetch(`${backend}/auth/from-auth0`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: event.user.name || event.user.nickname || '',
        email: event.user.email || '',
        auth0_id: event.user.sub,
      }),
    });
  } catch (err) {
    console.warn('Failed to notify backend of new user', err);
  }
};
