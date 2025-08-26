import  { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import api from '../api';
import fetchClients from '../utils/clients';
import { useAuth0 } from '@auth0/auth0-react';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabaseBucket = process.env.REACT_APP_SUPABASE_BUCKET;
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    realtime: { enabled: false }
});

const AlbumForm = ({ }) => {
  const [albumName, setAlbumName] = useState('');
  const [photos, setPhotos] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [uploadedUrls, setUploadedUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [clientId, setClientId] = useState('');

  const { getAccessTokenSilently } = useAuth0();

  // Fetch users for admin dropdown
  useEffect(() => {
    async function fetchUsers() {
      try {
        let token;
        try {
          // prefer audience when configured for Auth0 API
          token = await getAccessTokenSilently({
            audience: process.env.REACT_APP_AUTH0_AUDIENCE,
          });
        } catch (tErr) {
          // token may fail when audience isn't configured; keep going to try unauthenticated fetch for debugging
          console.warn('getAccessTokenSilently failed:', tErr?.message || tErr);
        }
        // Prefer fetching via the helper which will use configured API base or fallback URL
        try {
          const data = await fetchClients({ token });
          console.log('data:', data);
          // helper returns either { users: [...] } or an array
          if (Array.isArray(data)) setUsers(data);
          else if (data && data.users) setUsers(data.users);
          else if (data && data.clients) setUsers(data.clients);
          else setUsers([]);
        } catch (err) {
          console.warn('fetchClients failed, falling back to /auth/users:', err.message || err);
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
      }
    }
    fetchUsers();
  }, [getAccessTokenSilently]);

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files);
    setPhotos(files);
    setPreviews(files.map((file) => URL.createObjectURL(file)));
    setUploadedUrls([]); // reset uploaded URLs on new selection
  };
  
  const uploadFileToSupabase = async (file, clientId) => {
    try {
      // Create a unique file path, e.g. clientId/filename-timestamp.ext
      const timestamp = Date.now();
      const fileExt = file.name.split('.').pop();
      const fileName = `${file.name.replace(/\.[^/.]+$/, '')}-${timestamp}.${fileExt}`;
      const filePath = `${clientId}/${fileName}`;
      const { data, error } = await supabase.storage
        .from(supabaseBucket)
        .upload(filePath, file);

      if (error) {
        throw error;
      }

      // Get public URL
      const { publicURL, error: urlError } = supabase.storage
        .from(supabaseBucket)
        .getPublicUrl(filePath);

      if (urlError) {
        throw urlError;
      }

      return publicURL;
    } catch (error) {
      console.error('Error uploading file to Supabase:', error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (photos.length === 0 || !clientId) {
      alert('Please select a client and at least one photo.');
      return;
    }

    try {
      setLoading(true);

      // Upload each photo directly to Supabase Storage
      const uploadPromises = photos.map(photo => uploadFileToSupabase(photo, clientId));

      const urls = await Promise.all(uploadPromises);

      setUploadedUrls(urls);
      alert('Photos uploaded successfully.');

      // Reset form inputs except client selection
      setPhotos([]);
      setPreviews([]);
    } catch (error) {
      console.error('Error uploading photos:', error);
      alert('Error uploading photos. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: '20px', border: '1px solid #ccc', padding: '15px', borderRadius: '8px' }}>
      <h2>Upload Photos</h2>
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

        {uploadedUrls.length > 0 && (
          <div style={{ marginTop: '10px' }}>
            <h3>Uploaded Photos:</h3>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {uploadedUrls.map((url, index) => (
                <img key={index} src={url} alt={`Uploaded ${index}`} style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '5px' }} />
              ))}
            </div>
          </div>
        )}

        <button type="submit" disabled={loading} style={{ marginTop: '10px', padding: '6px 12px' }}>
          {loading ? 'Uploading...' : 'Upload Photos'}
        </button>
      </form>
    </div>
  );
};

export default AlbumForm;