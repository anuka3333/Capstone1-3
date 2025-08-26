import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';
import pool from '../db.js';

// Environment variables required:
// AUTH0_DOMAIN (e.g. your-domain.us.auth0.com)
// AUTH0_AUDIENCE (API identifier)
const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN;
const AUTH0_AUDIENCE = process.env.AUTH0_AUDIENCE;

if (!AUTH0_DOMAIN || !AUTH0_AUDIENCE) {
  console.warn('Warning: AUTH0_DOMAIN or AUTH0_AUDIENCE not set — Auth middleware may fail');
}

const client = jwksClient({
  jwksUri: `https://${AUTH0_DOMAIN}/.well-known/jwks.json`,
  cache: true,
  rateLimit: true,
});

function getKey(header, callback) {
  client.getSigningKey(header.kid, function (err, key) {
    if (err) return callback(err);
    const signingKey = key.getPublicKey ? key.getPublicKey() : key.rsaPublicKey;
    callback(null, signingKey);
  });
}

export function authMiddleware(roleRequired) {
  return async (req, res, next) => {
    try {
      const auth = req.headers['authorization'];
      if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ message: 'No token provided' });
      const token = auth.split(' ')[1];

      // Verify token using JWKS
      const decoded = await new Promise((resolve, reject) => {
        jwt.verify(
          token,
          getKey,
          {
            audience: AUTH0_AUDIENCE,
            issuer: `https://${AUTH0_DOMAIN}/`,
            algorithms: ['RS256'],
          },
          (err, decoded) => {
            if (err) return reject(err);
            resolve(decoded);
          }
        );
      });

      // decoded should contain sub (Auth0 user id) and possibly app metadata or roles
      const auth0Id = decoded.sub;
      // try to find local user by auth0_id
      let userRes = await pool.query('SELECT id, name, email, role FROM users WHERE auth0_id = $1', [auth0Id]);
      let localUser = userRes.rows[0];

      // If not found, create a client record (auto-provision)
      if (!localUser) {
        const name = decoded.name || decoded['nickname'] || '';
        const email = decoded.email || '';
        const insertRes = await pool.query(
          'INSERT INTO users (name, email, role, auth0_id) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role',
          [name, email, 'client', auth0Id]
        );
        localUser = insertRes.rows[0];
      }

      // Determine whether this is a machine/client token. Auth0 client_credentials tokens
      // often include gty: 'client-credentials' and the sub may end with '@clients'.
      const grantType = decoded.gty || decoded['gty'] || null;
      const isMachineToken = String(grantType) === 'client-credentials' || String(auth0Id || '').endsWith('@clients') || String(auth0Id || '').includes('@clients');

      // Determine roles: prefer token claims but never allow machine tokens to grant admin.
      const tokenRoles = decoded['https://anukaphotos333/roles'] || decoded.roles || decoded['role'];
      const localRole = localUser.role || 'client';
      let roles = [];
      if (Array.isArray(tokenRoles)) roles.push(...tokenRoles.map(r => String(r).toLowerCase()));
      else if (typeof tokenRoles === 'string') roles.push(...tokenRoles.split(',').map(r => r.trim().toLowerCase()));

      // If token looks like a machine token, ignore any admin role coming from the token.
      if (isMachineToken) {
        roles = roles.filter(r => r !== 'admin');
      }

      // Always fall back to the local DB role if no roles present or token didn't provide usable roles
      if (!roles.length) roles.push(String(localRole).toLowerCase());

      // Prevent machine tokens from using a promoted DB admin role for admin-required endpoints
      if (isMachineToken && String(localRole).toLowerCase() === 'admin') {
        // keep roles as non-admin; explicit admin actions will be rejected below
        roles = roles.filter(r => r !== 'admin');
      }

      req.user = {
        id: localUser.id,
        auth0Id,
        name: localUser.name,
        email: localUser.email,
        roles,
        _isMachineToken: isMachineToken,
      };

      if (roleRequired) {
        const required = String(roleRequired).toLowerCase();
        // If admin access is required, explicitly reject machine tokens
        if (required === 'admin' && isMachineToken) {
          return res.status(403).json({ message: 'Machine/client tokens are not permitted for admin actions' });
        }
        if (!req.user.roles.includes(required)) return res.status(403).json({ message: 'Forbidden' });
      }

      next();
    } catch (err) {
      console.error('Auth middleware error:', err.message || err);
      return res.status(401).json({ message: 'Invalid token or auth error', detail: err.message });
    }
  };
}
