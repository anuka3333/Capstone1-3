import React, { useState } from 'react';

const AlbumForm = ({ onCreate }) => {
  const [albumName, setAlbumName] = useState('');
  const [photos, setPhotos] = useState([]);
  const [previews, setPreviews] = useState([]);

  // Handle file selection
  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files);
    setPhotos(files);

    // Create previews
    const urls = files.map((file) => URL.createObjectURL(file));
    setPreviews(urls);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!albumName || photos.length === 0) {
      alert('Please provide album name and at least one photo.');
      return;
    }

    // Pass data to parent handler
    onCreate({ albumName, photos });

    // Reset form
    setAlbumName('');
    setPhotos([]);
    setPreviews([]);
  };

  return (
    <div style={{ marginTop: '20px' }}>
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
              <img
                key={index}
                src={url}
                alt={`Preview ${index}`}
                style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '5px' }}
              />
            ))}
          </div>
        )}

        <button type="submit" style={{ marginTop: '10px', padding: '6px 12px' }}>
          Create Album
        </button>
      </form>
    </div>
  );
};

export default AlbumForm;