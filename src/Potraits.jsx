import React from 'react';
import { useOutletContext } from 'react-router-dom';

export default function Portraits() {
  const { editMode } = useOutletContext();

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
        <img
          src="/elizabeth.jpg"
          alt="Portrait 1"
          style={{ width: '300px', maxWidth: '90%', borderRadius: '8px', cursor: editMode ? 'pointer' : 'default' }}
          title={editMode ? 'Click to edit image' : ''}
        />
        <img
          src="/potrait.jpg"
          alt="Portrait 2"
          style={{ width: '300px', maxWidth: '90%', borderRadius: '8px', cursor: editMode ? 'pointer' : 'default' }}
          title={editMode ? 'Click to edit image' : ''}
        />
        <img
          src="/Portraits/IMG_3600.JPG"
          alt="Portrait IMG_3600"
          style={{ width: '300px', maxWidth: '90%', borderRadius: '8px', cursor: editMode ? 'pointer' : 'default' }}
          title={editMode ? 'Click to edit image' : ''}
        />
        <img
          src="/Portraits/IMG_3643.JPG"
          alt="Portrait IMG_3643"
          style={{ width: '300px', maxWidth: '90%', borderRadius: '8px', cursor: editMode ? 'pointer' : 'default' }}
          title={editMode ? 'Click to edit image' : ''}
        />
        <img
          src="/Portraits/IMG_4110.JPG"
          alt="Portrait IMG_4110"
          style={{ width: '300px', maxWidth: '90%', borderRadius: '8px', cursor: editMode ? 'pointer' : 'default' }}
          title={editMode ? 'Click to edit image' : ''}
        />
        <img
          src="/Portraits/IMG_2937.JPG"
          alt="Portrait IMG_2947"
          style={{ width: '300px', maxWidth: '90%', borderRadius: '8px', cursor: editMode ? 'pointer' : 'default' }}
          title={editMode ? 'Click to edit image' : ''}
        />
        <img
          src="/Portraits/IMG_3667.JPG"
          alt="Portrait IMG_3667"
          style={{ width: '300px', maxWidth: '90%', borderRadius: '8px', cursor: editMode ? 'pointer' : 'default' }}
          title={editMode ? 'Click to edit image' : ''}
        />
        <img
          src="/Portraits/IMG_3631.JPG"
          alt="Portrait IMG_3631"
          style={{ width: '300px', maxWidth: '90%', borderRadius: '8px', cursor: editMode ? 'pointer' : 'default' }}
          title={editMode ? 'Click to edit image' : ''}
        />
      </div>
    </div>
  );
}