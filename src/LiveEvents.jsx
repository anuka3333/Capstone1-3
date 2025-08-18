import React from 'react';

const liveImages = [
  'IMG_0905.JPG',
  'IMG_1507.JPG',
  'IMG_4624.JPG',
  'IMG_4579.JPG',
  'IMG_0217.JPG',
  'IMG_1850.JPG',
  'IMG_3301.JPG',
  'IMG_3297.JPG',
  'IMG_3237.JPG',
  'IMG_3116.JPG',
  'IMG_3043.JPG',
  'IMG_2999.JPG',
  'IMG_1567.JPG',
  'IMG_1540.JPG',
];

export default function LiveEventsGallery() {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '20px',
          marginTop: '1rem',
          maxWidth: '640px',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
      >
        {liveImages.map((img, idx) => (
          <img
            key={img}
            src={'/Live/' + img}
            alt={`Live Event ${idx + 1}`}
            style={{ width: '300px', maxWidth: '90%', borderRadius: '8px' }}
          />
        ))}
      </div>
    </div>
  );
}
