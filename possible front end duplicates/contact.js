// src/pages/Contact.js
import React from 'react';

export default function Contact() {
  return (
    <div style={{ padding: "2rem", maxWidth: "300px", margin: "0 auto", textAlign: "center" }}>

      <p><strong>Email:</strong> <a href="mailto:anukaprints@gmail.com">anukaprints@gmail.com</a></p>
      <p><strong>Phone:</strong> (773) 691-3911</p>
      <p><strong>Location:</strong> Chicago, IL</p>

      <hr style={{ margin: "2rem 0" }} />

      <form
        action="https://formspree.io/f/xjkobzgy" 
        method="POST"
        style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
      >
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          required
          style={{ padding: "0.5rem", fontSize: "1rem" }}
        />
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          required
          style={{ padding: "0.5rem", fontSize: "1rem" }}
        />
        <textarea
          name="message"
          placeholder="Your Message"
          required
          rows="5"
          style={{ padding: "0.5rem", fontSize: "1rem" }}
        />
        <button
          type="submit"
          style={{
            padding: "0.75rem",
            fontSize: "1rem",
            backgroundColor: "#000",
            color: "#fff",
            border: "none",
            cursor: "pointer"
          }}
        >
          Send Message
        </button>
      </form>
    </div>
  );
}
