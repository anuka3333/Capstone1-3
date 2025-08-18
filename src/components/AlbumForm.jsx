import React, { useState, useEffect } from 'react';
import axios from 'axios';
import api from '../api';
import { useAuth0 } from '@auth0/auth0-react';

const AlbumForm = ({ onAlbumCreated }) => {
  const [albumName, setAlbumName] = useState('');
  const [photos, setPhotos] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [clientId, setClientId] = useState('');

  const { getAccessTokenSilently } = useAuth0();

  // Fetch users for admin dropdown
  useEffect(() => {
    async function fetchUsers() {
      try {
        const token = await getAccessTokenSilently();
        const res = await api.get('/auth/users', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(res.data.users || []);
      } catch (err) {
        console.error('Failed to fetch users:', err);
      }
    }
    fetchUsers();
  }, [getAccessTokenSilently]);

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files);
    setPhotos(files);
    setPreviews(files.map((file) => URL.createObjectURL(file)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!albumName || photos.length === 0 || !clientId) {
      alert('Please provide album name, select a client, and at least one photo.');
      return;
    }

    const formData = new FormData();
    formData.append('albumName', albumName);
    formData.append('clientId', clientId);
    photos.forEach((photo) => formData.append('photos', photo));

    try {
      setLoading(true);
      const token = await getAccessTokenSilently();
      const response = await api.post('/api/albums/create', formData, {
        headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` },
      });
      console.log('Album created:', response.data);
      onAlbumCreated(); // refresh albums list

      // Reset form
      setAlbumName('');
      setPhotos([]);
      setPreviews([]);
      setClientId('');
    } catch (error) {
      console.error('Error creating album:', error);
      alert('Error creating album.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: '20px', border: '1px solid #ccc', padding: '15px', borderRadius: '8px' }}>
      <h2>Create New Album</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label>
            Select Client:
            <select value={clientId} onChange={e => setClientId(e.target.value)} required style={{ marginLeft: '10px' }}>
              <option value="">-- Select Client --</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>{user.name} ({user.email})</option>
              ))}
            </select>
          </label>
        </div>
        <div>
          <label>
            Album Name:
            <input
              type="text"
              value={albumName}
              onChange={(e) => setAlbumName(e.target.value)}
              required
              style={{ marginLeft: '10px' }}
            />
          </label>
        </div>

        <div style={{ marginTop: '10px' }}>
          <label>
            Upload Photos:
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handlePhotoChange}
              style={{ marginLeft: '10px' }}
            />
          </label>
        </div>

        {previews.length > 0 && (
          <div style={{ marginTop: '10px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {previews.map((url, index) => (
              <img key={index} src={url} alt={`Preview ${index}`} style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '5px' }} />
            ))}
          </div>
        )}

        <button type="submit" disabled={loading} style={{ marginTop: '10px', padding: '6px 12px' }}>
          {loading ? 'Uploading...' : 'Create Album'}
        </button>
      </form>
    </div>
  );
};

export default AlbumForm;