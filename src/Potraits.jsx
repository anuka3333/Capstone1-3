import React from 'react';
import { useOutletContext } from 'react-router-dom';

export default function Portraits() {
  const { editMode } = useOutletContext();

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px' }}>
      <img
        src="/elizabeth.jpg"
        alt="Portrait 1"
        style={{ width: '300px', cursor: editMode ? 'pointer' : 'default' }}
        title={editMode ? 'Click to edit image' : ''}
      />
      <img
        src="/potrait.jpg"
        alt="Portrait 2"
        style={{ width: '300px', cursor: editMode ? 'pointer' : 'default' }}
        title={editMode ? 'Click to edit image' : ''}
      />
    </div>
  );
}