import React, { useEffect, useState } from 'react';

function LiveEventsGallery() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('https://your-api.com/live-events') // Replace with your real API
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch photos');
        return res.json();
      })
      .then(data => setPhotos(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading live event photos...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <section className="p-6">
      <h2 className="text-3xl font-bold mb-4">Live Event Highlights</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {photos.map(photo => (
          <div key={photo.id} className="shadow-md rounded-lg overflow-hidden">
            <img
              src={photo.url}
              alt={photo.title}
              className="w-full h-60 object-cover"
            />
            <div className="p-2">
              <h3 className="text-lg font-semibold">{photo.title}</h3>
              {photo.description && (
                <p className="text-sm text-gray-600">{photo.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default LiveEventsGallery;
