import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import AlbumForm from './AlbumForm';
import axios from 'axios';

const Albums = () => {
  // 1. Destructure isLoading from the useAuth0 hook
  const { user, isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();
  const [albums, setAlbums] = useState([]);

  // This check is now more robust because of the isLoading guard above it.
  const roles = user?.['https://anukaphotos333/roles'] || [];


  const fetchAlbums = async () => {
    try {
      // As mentioned before, you will need this for the client view to work correctly
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
    // Only fetch albums if authentication is complete and successful
    if (isAuthenticated) {
      fetchAlbums();
    }
  }, [isAuthenticated]); // This dependency is correct

  // 2. Add a loading state. This is the crucial part.
  // It prevents the rest of the component from rendering until Auth0 is ready.
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // This guard is still good for users who are not logged in at all.
  if (!isAuthenticated || !user) {
    return <div>Please log in to view albums.</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Albums</h1>

      {/* This condition will now work reliably because 'user' is guaranteed to be populated */}
      {roles.includes('Admin') && <AlbumForm onAlbumCreated={fetchAlbums} />}

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