import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import AlbumForm from './AlbumForm';
import axios from 'axios';

const Albums = () => {
  const { user, isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();
  const [albums, setAlbums] = useState([]);

  // Debug logging (use JSON.stringify so console shows a snapshot)
  console.log('Albums component render:');
  console.log('isLoading:', isLoading);
  console.log('isAuthenticated:', isAuthenticated);
  console.log('user:', JSON.stringify(user));
  
  // Normalize roles: handle array, comma-separated string, or single role string
  const rawRoles = user?.['https://anukaphotos333/roles'] || user?.roles || user?.role || user?.['roles'];
  let roles = [];
  if (Array.isArray(rawRoles)) {
    roles = rawRoles;
  } else if (typeof rawRoles === 'string' && rawRoles.trim() !== '') {
    roles = rawRoles.split(',').map(r => r.trim());
  } else if (rawRoles) {
    // fallback for single non-array value
    roles = [String(rawRoles)];
  }
  // Normalize to lowercase for case-insensitive checks
  const normalizedRoles = roles.map(r => String(r).toLowerCase());
  console.log('raw roles:', JSON.stringify(rawRoles), 'normalized roles:', JSON.stringify(normalizedRoles), 'isArray:', Array.isArray(rawRoles));
  const isAdmin = normalizedRoles.includes('admin');
  const debugString = `rawRoles: ${JSON.stringify(rawRoles)}\nnormalizedRoles: ${JSON.stringify(normalizedRoles)}\nisAdmin: ${isAdmin}`;
  console.log(debugString);
      const fetchAlbums = async () => {
    try {
      const token = await getAccessTokenSilently();
      const response = await axios.get('/api/albums', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAlbums(response.data);
    } catch (err) {
      console.error("Failed to fetch albums:", err);
    }
  };

  useEffect(() => {

    if (isAuthenticated && user) {
      fetchAlbums();
    }
  }, [isAuthenticated, user, fetchAlbums]);

  // More robust loading check
  if (isLoading || (isAuthenticated && !user)) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <div>Please log in to view albums.</div>;
  }

  // roles already normalized above; use isAdmin from earlier

  return (
    <div style={{ padding: '20px' }}>
      <h1>Albums</h1>
      
      {/* Debug: show role detection values on the page */}
      <pre style={{ whiteSpace: 'pre-wrap', background: '#f6f8fa', padding: '8px', borderRadius: '4px' }}>
        {debugString}
      </pre>

      {/* Show the form if user is admin */}
      {isAdmin && <AlbumForm onAlbumCreated={fetchAlbums} />}

      {/* List all albums */}
      <div style={{ marginTop: '20px' }}>
        {albums.length === 0 ? (
          <p>No albums available.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {albums.map((album) => (
              <li key={album.id} style={{ marginBottom: '20px' }}>
                <h3>{album.name}</h3>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {album.photos.map((photo, idx) => (
                    <img
                      key={idx}
                      src={photo.url}
                      alt={photo.name}
                      style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: '5px' }}
                    />
                  ))}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Albums;