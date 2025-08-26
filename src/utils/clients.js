import api from '../api';

/**
 * Fetch clients from the backend.
 * If a token is provided it will be sent in the Authorization header.
 * Uses the configured API base if present, otherwise falls back to http://127.0.0.1:5000
 *
 * @param {{ token?: string }} options
 * @returns {Promise<any>} response data
 */
export async function fetchClients({ token } = {}) {
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;

  // Prefer configured API base
  try {
    const base = (process.env.REACT_APP_API_URL || '').trim();
    if (base) {
      const res = await api.get('/clients', { headers });
      return res.data;
    }

    // fallback to explicit URL
    const res = await fetch('http://127.0.0.1:5000/clients', { headers: { ...headers } });
    if (!res.ok) throw new Error(`Fetch failed: ${res.status} ${res.statusText}`);
    return await res.json();
  } catch (err) {
    // bubble error with a helpful message
    throw new Error(`fetchClients error: ${err.message}`);
  }
}

export default fetchClients;
