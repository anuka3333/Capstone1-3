import React, { useState, useEffect, useCallback } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import AlbumForm from './AlbumForm';
import AlbumCreateForm from './AlbumCreateForm';
import api from '../api';

const Albums = () => {
  const { user, isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();
  const [albums, setAlbums] = useState([]);
  const [bucketImages, setBucketImages] = useState([]);

  const fetchSupabaseImages = useCallback(async () => {
    try {
      const token = await getAccessTokenSilently({ audience: process.env.REACT_APP_AUTH0_AUDIENCE });
      const response = await fetch('http://127.0.0.1:5000/gallery/photos', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch images from Supabase bucket');
      }
      
      const data = await response.json();
      setBucketImages(data);
      console.log('Fetched images from Supabase:', data);
    } catch (error) {
      console.error('Error fetching Supabase images:', error);
    }
  }, [getAccessTokenSilently]);

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

  const fetchAlbums = useCallback(async () => {
    try {
      const token = await getAccessTokenSilently({ audience: process.env.REACT_APP_AUTH0_AUDIENCE });
  const url = isAdmin ? '/api/albums' : '/api/albums/my';
      const response = await api.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // For /my, albums are in response.data.albums; for /albums, may be response.data or response.data.albums
      setAlbums(response.data.albums || response.data);
    } catch (err) {
      console.error("Failed to fetch albums:", err);
    }
  }, [getAccessTokenSilently, isAdmin]);

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchAlbums();
      fetchSupabaseImages(); // Fetch Supabase images when component mounts
    }
  }, [isAuthenticated, user, fetchAlbums, fetchSupabaseImages]);

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
      <h1>Photo Gallery</h1>

      {/* Show the form if user is admin */}
      {isAdmin && <AlbumForm onAlbumCreated={fetchAlbums} />}

      {/* List all albums */}
      {/* Display all images from Supabase bucket */}
      <div style={{ marginTop: '20px' }}>
        <h2>All Photos</h2>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '30px' }}>
          {bucketImages.map((photo, idx) => (
            <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <img
                src={photo.url}
                alt={photo.filename}
                style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: '5px' }}
              />
              <span style={{ fontSize: '0.8em', marginTop: '5px' }}>{photo.filename}</span>
              <a href={photo.url} download style={{ marginTop: '5px' }}>
                <button style={{ padding: '4px 10px', fontSize: '0.9em' }}>Download</button>
              </a>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: '20px' }}>
        <h2>Albums</h2>
        {isAdmin && (
          <div style={{ marginBottom: '20px' }}>
            <AlbumCreateForm onCreated={fetchAlbums} />
          </div>
        )}
        {albums.length === 0 ? (
          <p>No albums available.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {albums.map((album) => (
              <li key={album.id} style={{ marginBottom: '20px' }}>
                <h3>{album.name}</h3>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {album.photos.map((photo, idx) => (
                    <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <img
                        src={photo.url}
                        alt={photo.name}
                        style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: '5px' }}
                      />
                      <a href={photo.url.startsWith('http') ? photo.url : (process.env.REACT_APP_API_URL || '') + photo.url} download style={{ marginTop: '5px' }}>
                        <button style={{ padding: '4px 10px', fontSize: '0.9em' }}>Download</button>
                      </a>
                    </div>
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