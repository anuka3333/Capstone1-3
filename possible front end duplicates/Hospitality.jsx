import React, { useEffect, useState } from 'react';

export default function HospitalityGallery() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const mockPhotos = [
      {
        id: 1,
        title: "Mykonos Greek Restaurant",
        url: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe"
      },
      {
        id: 2,
        title: "Modern Hotel Lobby",
        url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb"
      },
      {
        id: 3,
        title: "Sunset Rooftop Bar",
        url: "https://images.unsplash.com/photo-1494526585095-c41746248156"
      },
      {
        id: 4,
        title: "Cafe Interior",
        url: "https://images.unsplash.com/photo-1528605248644-14dd04022da1"
      }
    ];

    setTimeout(() => {
      setPhotos(mockPhotos);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) return <p>Loading hospitality photos...</p>;

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>Hospitality Photo Highlights</h1>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "20px",
          marginTop: "1rem",
          maxWidth: "640px",  // Limit container width to fit two images per row
          marginLeft: "auto",
          marginRight: "auto"
        }}
      >
        {photos.map(photo => (
          <img
            key={photo.id}
            src={photo.url}
            alt={photo.title}
            style={{ width: "300px", borderRadius: "8px" }}
          />
        ))}
      </div>
    </div>
  );
}
