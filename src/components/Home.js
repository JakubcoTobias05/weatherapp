import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Home() {
  const [videoSrc, setVideoSrc] = useState(null);
  const [user, setUser] = useState(null);

  // Načtení náhodného videa při mountu
  useEffect(() => {
    const videos = [
      '/assets/video/bg01_video.mp4',
      '/assets/video/bg02_video.mp4',
      '/assets/video/bg03_video.mp4',
      '/assets/video/bg04_video.mp4'
    ];
    const randomIndex = Math.floor(Math.random() * videos.length);
    setVideoSrc(videos[randomIndex]);
  }, []);

  // Získání přihlášeného uživatele z localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <div className="home">
      {videoSrc && (
        <video className="bg-video" autoPlay muted loop>
          <source src={videoSrc} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
      <div
        className="home-overlay"
        style={{
          position: 'absolute',
          top: '50%',
          left: '10%',
          transform: 'translateY(-50%)',
          textAlign: 'left',
          color: '#fff'
        }}
      >
        <h1 style={{ fontSize: '3em', marginBottom: '20px' }}>
          Vítejte v WeatherApp
        </h1>
        <p style={{ fontSize: '1.5em', marginBottom: '30px' }}>
          Získejte přehled o aktuálním počasí a měřeních, které vám poskytujeme.
        </p>
        <div className="home-nav">
          {user ? (
            <Link to="/dashboard" className="home-button">
              Dashboard
            </Link>
          ) : (
            <Link to="/register" className="home-button">
              Vytvořit účet
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
