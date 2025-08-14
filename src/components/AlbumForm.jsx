import React, { useState } from 'react';
import axios from 'axios';

const AlbumForm = ({ onAlbumCreated }) => {
  const [albumName, setAlbumName] = useState('');
  const [photos, setPhotos] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files);
    setPhotos(files);
    setPreviews(files.map((file) => URL.createObjectURL(file)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!albumName || photos.length === 0) {
      alert('Please provide album name and at least one photo.');
      return;
    }

    const formData = new FormData();
    formData.append('name', albumName);
    photos.forEach((photo) => formData.append('photos', photo));

    try {
      setLoading(true);
      const response = await axios.post('/api/albums', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log('Album created:', response.data);
      onAlbumCreated(); // refresh albums list

      // Reset form
      setAlbumName('');
      setPhotos([]);
      setPreviews([]);
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