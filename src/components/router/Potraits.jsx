import React from 'react';

export default function Portraits() {
  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>Portraits</h1>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "20px" }}>
        <img src="/potrait.jpg" alt="Portrait 1" style={{ width: "300px" }} />
        <img src="/IMG_3600.jpg" alt="Portrait 2" style={{ width: "300px" }} />
      </div>
    </div>
  );
}