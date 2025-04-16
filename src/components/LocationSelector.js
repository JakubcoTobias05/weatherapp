import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function LocationSelector() {
  const [city, setCity] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('location.php', { city: city.trim() });
      setMessage(res.data.message);
      navigate('/dashboard');
    } catch (error) {
      setMessage(error.response?.data.error || 'Chyba při nastavování lokace.');
    }
  };

  return (
    <div className="container">
      <h1>Zvolte lokaci</h1>
      <form onSubmit={handleSubmit} autoComplete="off">
        <label htmlFor="city">Zadejte název města nebo PSČ:</label>
        <input 
          type="text" 
          id="city"
          value={city} 
          onChange={(e) => setCity(e.target.value)} 
          required 
          maxLength="100"
        />
        <button type="submit">Uložit lokaci</button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
}

export default LocationSelector;
