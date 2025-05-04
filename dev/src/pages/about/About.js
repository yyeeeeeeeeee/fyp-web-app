import React from 'react';
import "./about.css";

function About() {
  return (
    <div className='about-us-container'>
      <div className="about-container">
        <div className="about-header">
          <h1>About Us</h1>
          <p>Learn more about our journey and mission.</p>
        </div>

        <div className="about-content">
          <div className="about-section">
            <h2>Our Story</h2>
            <p>
              We started with a passion for music and a dream to connect people
              through melodies. Our platform allows music lovers to share, discover,
              and enjoy tracks from around the world.
            </p>
          </div>

          <div className="about-section">
            <h2>Our Mission</h2>
            <p>
              To build a vibrant music community that empowers artists and fans alike,
              making music discovery fun, easy, and social.
            </p>
          </div>

          <div className="about-section">
            <h2>Meet the Team</h2>
            <p>
              Our team is made up of developers, designers, and music enthusiasts
              working together to bring the best experience to you.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;