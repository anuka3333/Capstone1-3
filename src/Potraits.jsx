import React from 'react';

export default function Portraits() {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "20px" }}>
      <img src="/elizabeth.jpg" alt="Portrait 1" style={{ width: "300px" }} />
      <img src="/potrait.jpg" alt="Portrait 2" style={{ width: "300px" }} />
    </div>
  );
}