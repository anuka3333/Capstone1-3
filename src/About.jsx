import React from 'react';

export default function About() {
  const containerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start', // keep content starting from left
    width: '100%',
    margin: 0,
    padding: 0,
  };

  const photoStyle = {
    width: '35%',
    marginLeft: '5%',   // pushes photo toward center-left
  };

  const imgStyle = {
    width: '100%',
    height: 'auto',
    borderRadius: '0',
    objectFit: 'cover',
    display: 'block',
  };

  const textStyle = {
    width: '55%',       // adjust to keep total at 100%
    textAlign: 'left',
    fontFamily: "'Playfair Display', serif",
    color: '#3e2723',
    margin: 0,
    paddingLeft: '2rem',
  };

  return (
    <div style={containerStyle}>
      {/* Photo more toward center-left */}
      <div style={photoStyle}>
        <img src="/About.jpg" alt="Anu Kherlen" style={imgStyle} />
      </div>

      {/* Text on the right */}
      <div style={textStyle}>
        <p style={{ margin: 0 }}>
          Anu Kherlen is a photographer based in Chicago, IL. 
           She used to believe only writers could be storytellers, but photography proved her otherwise. 
           Storytelling is capturing little moments and weaving them into something bigger.
           Through her lens, Anu hopes to turn everyday scenes, emotions, and experiences into visual stories that stays with you.
        </p>
         <p className="quote" style={{ marginTop: '1.5rem' }}>
    <em>“I paint flowers so they will not die.” – Frida Kahlo</em>
  </p>
      </div>
    </div>
  );
}
