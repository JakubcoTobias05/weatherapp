import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';

const CheckIcon = () => (
  <svg width="16" height="16" fill="green" viewBox="0 0 16 16">
    <path d="M13.485 1.929a1 1 0 010 1.414L6.414 10.414a1 1 0 01-1.414 0L2.515 7.93a1 1 0 111.414-1.414l1.07 1.07 5.657-5.657a1 1 0 011.414 0z" />
  </svg>
);
const CrossIcon = () => (
  <svg width="16" height="16" fill="red" viewBox="0 0 16 16">
    <path d="M4.646 4.646a.5.5 0 01.708 0L8 7.293l2.646-2.647a.5.5 0 11.708.708L8.707 8l2.647 2.646a.5.5 0 01-.708.708L8 8.707l-2.646 2.647a.5.5 0 01-.708-.708L7.293 8 4.646 5.354a.5.5 0 010-.708z" />
  </svg>
);
const NeutralIcon = () => (
  <svg width="16" height="16" fill="#aaa" viewBox="0 0 16 16">
    <circle cx="8" cy="8" r="7" stroke="#aaa" strokeWidth="2" fill="none" />
  </svg>
);

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [persistentShowPassword, setPersistentShowPassword] = useState(false);
  const [hoverShowPassword, setHoverShowPassword] = useState(false);
  const effectiveShowPassword = persistentShowPassword || hoverShowPassword;
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const recaptchaRef = useRef(null);

  const passwordValidation = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    digitOrSpecial: /[0-9!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  const renderValidationIcon = (condition) => {
    if (password === '') return <NeutralIcon />;
    return condition ? <CheckIcon /> : <CrossIcon />;
  };

  const togglePasswordPersistent = () => {
    setPersistentShowPassword((prev) => !prev);
  };

  const handleMouseEnter = () => setHoverShowPassword(true);
  const handleMouseLeave = () => setHoverShowPassword(false);

  // Deklarace funkce renderPasswordToggleIcon musí být před použitím v renderu
  const renderPasswordToggleIcon = () => {
    const iconColor = "#aaa";
    if (effectiveShowPassword) {
      return (
        <svg 
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={togglePasswordPersistent}
          style={{ fill: iconColor, cursor: 'pointer' }}
          xmlns="http://www.w3.org/2000/svg" 
          width="24" 
          height="24" 
          viewBox="0 0 576 512"
        >
          <path d="M572.52 241.4C518.6 135.4 407.9 64 288 64 168.1 64 57.4 135.4 3.48 241.4a48.17 48.17 0 000 29.2C57.4 376.6 168.1 448 288 448c119.9 0 230.6-71.4 284.52-177.4a48.17 48.17 0 000-29.2zM320 256a32 32 0 01-32 32 32 32 0 01-32-32 32 32 0 0132-32 32 32 0 0132 32z"/>
          <line x1="96" y1="96" x2="480" y2="416" stroke={iconColor} strokeWidth="32" strokeLinecap="round"/>
        </svg>
      );
    } else {
      return (
        <svg 
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={togglePasswordPersistent}
          style={{ fill: iconColor, cursor: 'pointer' }}
          xmlns="http://www.w3.org/2000/svg" 
          width="24" 
          height="24" 
          viewBox="0 0 576 512"
        >
          <path d="M572.52 241.4C518.6 135.4 407.9 64 288 64 168.1 64 57.4 135.4 3.48 241.4a48.17 48.17 0 000 29.2C57.4 376.6 168.1 448 288 448c119.9 0 230.6-71.4 284.52-177.4a48.17 48.17 0 000-29.2zM288 400c-97 0-186.2-55.4-233.88-144C101.8 167.4 191 112 288 112c97 0 186.2 55.4 233.88 144C474.2 344.6 385 400 288 400zM288 176a80 80 0 1080 80 80 80 0 00-80-80z"/>
        </svg>
      );
    }
  };

  useEffect(() => {
    if (message !== '') {
      const timer = setTimeout(() => setMessage(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const isPasswordValid =
    passwordValidation.length &&
    passwordValidation.uppercase &&
    passwordValidation.lowercase &&
    passwordValidation.digitOrSpecial;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isPasswordValid) {
      setMessage("Heslo nesplňuje všechny požadované podmínky.");
      return;
    }
    const token = recaptchaRef.current.getValue();
    if (!token) {
      setMessage("Prosím ověřte, že nejste robot!");
      return;
    }
    try {
      const res = await axios.post('register.php', {
        name: name.trim(),
        email: email.trim(),
        password,
        recaptcha_token: token,
      });
      setMessage(res.data.message);
      navigate('/login');
    } catch (error) {
      setMessage(error.response?.data.error || 'Chyba při registraci.');
      if (recaptchaRef.current) {
        recaptchaRef.current.reset();
      }
    }
  };

  return (
    <div className="container">
      <h1>Registrace</h1>
      <form onSubmit={handleSubmit} autoComplete="off">
        <label htmlFor="name">Jméno:</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          maxLength="100"
          autoComplete="name"
        />
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          maxLength="100"
          autoComplete="email"
        />
        <label htmlFor="password">Heslo:</label>
        <div className="password-container" style={{ position: 'relative' }}>
          <input
            type={effectiveShowPassword ? "text" : "password"}
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength="6"
            autoComplete="new-password"
            style={{ width: '100%', paddingRight: '40px' }}
          />
          <div className="password-icon" style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)' }}>
            {renderPasswordToggleIcon()}
          </div>
        </div>
        <div className="password-validation" style={{ marginBottom: '20px' }}>
          <p>{renderValidationIcon(passwordValidation.length)} Minimálně 8 znaků</p>
          <p>{renderValidationIcon(passwordValidation.uppercase)} Alespoň jedno velké písmeno</p>
          <p>{renderValidationIcon(passwordValidation.lowercase)} Alespoň jedno malé písmeno</p>
          <p>{renderValidationIcon(passwordValidation.digitOrSpecial)} Alespoň jedno číslo nebo speciální znak</p>
        </div>
        <ReCAPTCHA
          ref={recaptchaRef}
          sitekey="6LdZVRcrAAAAAFIVvkj_baecO1N6dADklPmvhESj"
        />
        <button type="submit" style={{ marginTop: '20px' }}>Registrovat se</button>
      </form>
      {message && <p className="message">{message}</p>}
      <p>
        Již máte účet?{' '}
        <Link to="/login" className="form-link">
          Přihlaste se zde
        </Link>.
      </p>
    </div>
  );
}

export default Register;
