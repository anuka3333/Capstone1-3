import React from 'react';
import { useOutletContext } from 'react-router-dom';

export default function Portraits() {
  const { editMode } = useOutletContext();

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
        columnGap: '8px',
        rowGap: '20px',
        justifyItems: 'center',
        alignItems: 'start',
      }}
    >
      <img
        src="/elizabeth.jpg"
        alt="Portrait 1"
        style={{ width: '90%', maxWidth: '320px', cursor: editMode ? 'pointer' : 'default' }}
        title={editMode ? 'Click to edit image' : ''}
      />
      <img
        src="/potrait.jpg"
        alt="Portrait 2"
        style={{ width: '90%', maxWidth: '320px', cursor: editMode ? 'pointer' : 'default' }}
        title={editMode ? 'Click to edit image' : ''}
      />
      <img
        src="/Portraits/IMG_3600.JPG"
        alt="Portrait IMG_3600"
        style={{ width: '90%', maxWidth: '320px', cursor: editMode ? 'pointer' : 'default' }}
        title={editMode ? 'Click to edit image' : ''}
      />
      <img
        src="/Portraits/IMG_3643.JPG"
        alt="Portrait IMG_3643"
        style={{ width: '90%', maxWidth: '320px', cursor: editMode ? 'pointer' : 'default' }}
        title={editMode ? 'Click to edit image' : ''}
      />
      <img
        src="/Portraits/IMG_4110.JPG"
        alt="Portrait IMG_4110"
        style={{ width: '90%', maxWidth: '320px', cursor: editMode ? 'pointer' : 'default' }}
        title={editMode ? 'Click to edit image' : ''}
      />
      <img
        src="/Portraits/IMG_2947.JPG"
        alt="Portrait IMG_2947"
        style={{ width: '90%', maxWidth: '320px', cursor: editMode ? 'pointer' : 'default' }}
        title={editMode ? 'Click to edit image' : ''}
      />
    </div>
  );
}