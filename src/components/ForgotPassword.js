import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  //eslint-disable-next-line
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('forgot_password.php', {
        email: email.trim(),
      });
      setMessage(res.data.message);
    } catch (error) {
      setMessage(error.response?.data.error || 'Chyba při zasílání resetovacího emailu.');
    }
  };

  return (
    <div className="container">
      <h1>Reset hesla</h1>
      <form onSubmit={handleSubmit} autoComplete="off">
        <label htmlFor="email">Zadejte svůj email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          maxLength="100"
          autoComplete="email"
        />
        <button type="submit">Odeslat resetovací odkaz</button>
      </form>
      {message && <p className="message">{message}</p>}
      <p>
        Zpět na <Link to="/login">Přihlášení</Link>.
      </p>
    </div>
  );
}

export default ForgotPassword;
