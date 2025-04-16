import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Layout({ children }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user')) || null;
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await axios.get('logout.php');
      localStorage.removeItem('user');
      setShowUserMenu(false);
      navigate('/login');
    } catch (error) {
      console.error('Logout error', error);
    }
  };

  return (
    <div className="layout">
      <header 
        className={`header ${isScrolled ? 'shrink' : ''}`} 
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          backgroundColor: '#3498db',
          color: '#fff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: isScrolled ? '5px 20px' : '10px 20px',
          transition: 'all 0.3s ease',
          height: isScrolled ? '60px' : '80px'
        }}
      >
        <div className="header-left">
          <Link to="/" className="logo" style={{
            color: '#fff',
            textDecoration: 'none',
            fontSize: '1.5em',
            fontWeight: 'bold'
          }}>
            WeatherApp
          </Link>
        </div>
        <div className="header-right">
          {user ? (
            <div className="user-menu-container" style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
              <div 
                className="user-icon-container" 
                onClick={() => setShowUserMenu(!showUserMenu)}
                style={{ cursor: 'pointer' }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#fff" viewBox="0 0 448 512">
                  <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm89.6 32h-17.8a174.6 174.6 0 0 1-141.6 0H134.4A134.4 134.4 0 0 0 0 422.4V464a48 48 0 0 0 48 48h352a48 48 0 0 0 48-48v-41.6A134.4 134.4 0 0 0 313.6 288z"/>
                </svg>
              </div>
              <span style={{ marginLeft: '8px', color: '#fff', fontWeight: 'bold' }}>
                {user.name}
              </span>
              {showUserMenu && (
                <div
                  className="user-menu"
                  style={{
                    position: 'absolute',
                    top: '110%',  
                    right: 0,    
                    background: '#fff',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                    width: '150px',
                    zIndex: 1000
                  }}
                >
                  <Link
                    to="/dashboard"
                    className="user-menu-item"
                    onClick={() => setShowUserMenu(false)}
                    style={{
                      display: 'block',
                      padding: '10px',
                      color: '#333',
                      textDecoration: 'none'
                    }}
                  >
                    Dashboard
                  </Link>
                  <button
                    className="user-menu-item"
                    onClick={handleLogout}
                    style={{
                      display: 'block',
                      padding: '10px',
                      width: '100%',
                      border: 'none',
                      background: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    Odhlásit se
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="header-btn">Login</Link>
              <Link to="/register" className="header-btn">Register</Link>
            </>
          )}
        </div>
      </header>
      <main className="main-content">
        {children}
      </main>
      <footer 
        className="footer" 
        style={{
          backgroundColor: '#fff',
          color: '#222',
          textAlign: 'center',
          padding: '20px',
          borderTop: '1px solid #444',
          fontSize: '14px'
        }}
      >
        <p>&copy; {new Date().getFullYear()} WeatherApp. Všechna práva vyhrazena.</p>
      </footer>
      <ScrollToTop />
    </div>
  );
}

const ScrollToTop = () => {
    const [showScroll, setShowScroll] = useState(false);
  
    useEffect(() => {
      const checkScrollTop = () => {
        if (!showScroll && window.pageYOffset > window.innerHeight) {
          setShowScroll(true);
        } else if (showScroll && window.pageYOffset <= window.innerHeight) {
          setShowScroll(false);
        }
      };
      window.addEventListener('scroll', checkScrollTop);
      return () => window.removeEventListener('scroll', checkScrollTop);
    }, [showScroll]);
  
    const scrollTop = () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
  
    return (
      showScroll && (
        <div className="scrollTop" onClick={scrollTop} style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          backgroundColor: 'rgba(52, 152, 219, 0.8)',
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          cursor: 'pointer',
          transition: 'opacity 0.3s ease',
          zIndex: 1000
        }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#fff" viewBox="0 0 448 512">
            <path d="M34.9 289.5l184-184c9.4-9.4 24.6-9.4 33.9 0l184 184c9.4 9.4 2.7 25.5-11.9 25.5H46.8c-14.6 0-21.3-16.1-11.9-25.5z"/>
          </svg>
        </div>
      )
    );
  };  

export default Layout;
