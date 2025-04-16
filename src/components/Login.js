import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  const renderPasswordToggleIcon = () => {
    const iconColor = "#aaa";
    if (showPassword) {
      return (
        <svg 
          onClick={togglePasswordVisibility}
          style={{ fill: iconColor, cursor: 'pointer' }}
          xmlns="http://www.w3.org/2000/svg" 
          width="24" height="24" 
          viewBox="0 0 576 512"
        >
          <path d="M572.52 241.4C518.6 135.4 407.9 64 288 64 168.1 64 57.4 135.4 3.48 241.4a48.17 48.17 0 000 29.2C57.4 376.6 168.1 448 288 448c119.9 0 230.6-71.4 284.52-177.4a48.17 48.17 0 000-29.2zM320 256a32 32 0 01-32 32 32 32 0 01-32-32 32 32 0 0132-32 32 32 0 0132 32z"/>
          <line x1="96" y1="96" x2="480" y2="416" stroke={iconColor} strokeWidth="32" strokeLinecap="round"/>
        </svg>
      );
    } else {
      return (
        <svg 
          onClick={togglePasswordVisibility}
          style={{ fill: iconColor, cursor: 'pointer' }}
          xmlns="http://www.w3.org/2000/svg" 
          width="24" height="24" 
          viewBox="0 0 576 512"
        >
          <path d="M572.52 241.4C518.6 135.4 407.9 64 288 64 168.1 64 57.4 135.4 3.48 241.4a48.17 48.17 0 000 29.2C57.4 376.6 168.1 448 288 448c119.9 0 230.6-71.4 284.52-177.4a48.17 48.17 0 000-29.2zM288 400c-97 0-186.2-55.4-233.88-144C101.8 167.4 191 112 288 112c97 0 186.2 55.4 233.88 144C474.2 344.6 385 400 288 400zM288 176a80 80 0 1080 80 80 80 0 00-80-80z"/>
        </svg>
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('login.php', {
        email: email.trim(),
        password,
      });
      setMessage(res.data.message);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/dashboard');
    } catch (error) {
      setMessage(error.response?.data.error || 'Chyba při přihlášení.');
    }
  };

  return (
    <div className="container">
      <h1>Přihlášení</h1>
      <form onSubmit={handleSubmit} autoComplete="off">
        <label htmlFor="email">Email:</label>
        <input 
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          maxLength="100"
          autoComplete="username"
        />
        <label htmlFor="password">Heslo:</label>
        <div className="password-container">
          <input 
            type={showPassword ? "text" : "password"}
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength="6"
            autoComplete="current-password"
            style={{ width: '100%', paddingRight: '40px' }}
          />
          <div className="password-icon" style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)' }}>
            {renderPasswordToggleIcon()}
          </div>
        </div>
        <button type="submit">Přihlásit se</button>
      </form>
      {message && <p className="message">{message}</p>}
      <p>
        Zapomněli jste heslo? <Link to="/forgot-password">Resetovat heslo</Link>.
      </p>
    </div>
  );
}

export default Login;
