import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import api from '../api';
import fetchClients from '../utils/clients';

// A lightweight form to create an album for a selected client
// Style intentionally matches the Upload Photos form in AlbumForm.jsx
const containerStyle = {
  marginTop: '20px',
  border: '1px solid #ccc',
  padding: '15px',
  borderRadius: '8px'
};

const AlbumCreateForm = ({ onCreated }) => {
  const { getAccessTokenSilently } = useAuth0();
  const [users, setUsers] = useState([]);
  const [clientId, setClientId] = useState('');
  const [albumName, setAlbumName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);

  useEffect(() => {
    async function loadUsers() {
      try {
        let token;
        try {
          token = await getAccessTokenSilently({ audience: process.env.REACT_APP_AUTH0_AUDIENCE });
        } catch (tErr) {
          console.warn('getAccessTokenSilently failed:', tErr?.message || tErr);
        }
        try {
          const data = await fetchClients({ token });
          if (Array.isArray(data)) setUsers(data);
          else if (data && data.users) setUsers(data.users);
          else if (data && data.clients) setUsers(data.clients);
          else setUsers([]);
        } catch (err) {
          console.warn('fetchClients fallback to /auth/users');
          let res;
          if (token) {
            res = await api.get('/auth/users', { headers: { Authorization: `Bearer ${token}` } });
          } else {
            res = await api.get('/auth/users');
          }
          setUsers(res.data.users || res.data || []);
        }
      } catch (err) {
        console.error('Failed to fetch users:', err?.response?.data || err.message || err);
        setUsers([]);
      }
    }
    loadUsers();
  }, [getAccessTokenSilently]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!clientId || !albumName.trim()) {
      setError('Please select a client and enter an album name.');
      return;
    }
    if (files.length === 0) {
      setError('Please choose at least one file to upload to this album.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const token = await getAccessTokenSilently({ audience: process.env.REACT_APP_AUTH0_AUDIENCE });
      const createRes = await api.post('/api/albums/create', { clientId, albumName: albumName.trim() }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const albumId = createRes?.data?.albumId;
      if (!albumId) {
        throw new Error('Album created but no albumId returned.');
      }

      // Upload all selected files to this album
      const uploads = files.map(file => {
        const formData = new FormData();
        formData.append('file', file);
        return api.post(`/api/albums/${albumId}/upload`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      });
      const results = await Promise.allSettled(uploads);
      const failed = results.filter(r => r.status === 'rejected');
      if (failed.length > 0) {
        setError(`${failed.length} of ${results.length} file(s) failed to upload.`);
      }

      // Clear form fields (keep client selection for convenience)
      setAlbumName('');
      setFiles([]);
      setPreviews([]);
      if (typeof onCreated === 'function') onCreated();
    } catch (err) {
      console.error('Error creating album:', err?.response?.data || err.message || err);
      setError('Failed to create album. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilesChange = (e) => {
    const selected = Array.from(e.target.files || []);
    setFiles(selected);
    setPreviews(selected.map(f => URL.createObjectURL(f)));
  };

  return (
    <div style={containerStyle}>
      <h2>Upload Albums</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label>
            Select Client:
            <select value={clientId} onChange={e => setClientId(e.target.value)} required style={{ marginLeft: '10px' }}>
              <option value="">-- Select Client --</option>
              {users.map(user => (
                <option key={user.id || user.auth0_id || user.email} value={user.id || user.auth0_id || user.email}>
                  {user.name ? `${user.name} (${user.email || user.auth0_id || ''})` : (user.email || user.auth0_id)}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label>
            Album Name:
            <input
              type="text"
              value={albumName}
              onChange={e => setAlbumName(e.target.value)}
              required
              style={{ marginLeft: '10px' }}
            />
          </label>
        </div>

        <div style={{ marginTop: '10px' }}>
          <label>
            Choose Files:
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFilesChange}
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

        {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

        <button type="submit" disabled={loading} style={{ marginTop: '10px', padding: '6px 12px' }}>
          {loading ? 'Creating...' : 'Create Album'}
        </button>
      </form>
    </div>
  );
};

export default AlbumCreateForm;
