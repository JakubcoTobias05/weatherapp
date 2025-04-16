import React, { useState, useEffect } from 'react';
import { Chart } from 'react-google-charts';
import axios from 'axios';

function Dashboard() {
  const [city, setCity] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [weatherData, setWeatherData] = useState(null);

  // Vyhledávání měst – získává návrhy po zadání alespoň 3 znaků
  useEffect(() => {
    if (city.length > 2) {
      axios
        .get(`http://api.weatherapi.com/v1/search.json?key=a2ee36b2b1984d8ea47175921251304&q=${city}`)
        .then((res) => {
          setSuggestions(res.data);
        })
        .catch((err) => console.error(err));
    } else {
      setSuggestions([]);
    }
  }, [city]);

  const handleSelectCity = (selectedCity) => {
    setCity(selectedCity.name);
    setSuggestions([]);
    localStorage.setItem("city", selectedCity.name);
    fetchWeather(selectedCity.name);
  };

  const fetchWeather = (cityName) => {
    axios
      .get(`http://api.weatherapi.com/v1/forecast.json?key=a2ee36b2b1984d8ea47175921251304&q=${cityName}&days=1&aqi=no&alerts=no`)
      .then((res) => {
        setWeatherData(res.data);
      })
      .catch((err) => console.error(err));
  };

  // Při načtení dashboardu, pokud máte uložené město, načtěte data
  useEffect(() => {
    const savedCity = localStorage.getItem("city");
    if (savedCity) {
      setCity(savedCity);
      fetchWeather(savedCity);
    }
  }, []);

  // Příprava dat pro graf
  const chartData = [["Čas", "Teplota (°C)"]];
  if (weatherData) {
    const hours = weatherData.forecast.forecastday[0].hour;
    hours.forEach((hour) => {
      const time = new Date(hour.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      chartData.push([time, hour.temp_c]);
    });
  }

  return (
    <div className="container">
      <h1>Dashboard</h1>
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Vyhledejte město..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          style={{ padding: '10px', width: '100%', marginBottom: '5px' }}
        />
        {suggestions.length > 0 && (
          <ul className="suggestions" style={{ listStyle: 'none', padding: 0, margin: 0, border: '1px solid #ddd', borderRadius: '4px', background: '#fff' }}>
            {suggestions.map((s) => (
              <li
                key={s.id || s.name}
                onClick={() => handleSelectCity(s)}
                style={{ padding: '10px', cursor: 'pointer', borderBottom: '1px solid #ddd' }}
              >
                {s.name}, {s.region}, {s.country}
              </li>
            ))}
          </ul>
        )}
      </div>
      {weatherData ? (
        <div className="chart-section">
          <div className="chart-header">Graf teploty - {city}</div>
          <div className="chart-body">
            <Chart
              chartType="LineChart"
              data={chartData}
              options={{
                title: `Průběh teploty v ${city}`,
                curveType: "function",
                legend: { position: "bottom" },
              }}
              width="100%"
              height="400px"
            />
          </div>
        </div>
      ) : (
        <p>Načítám data...</p>
      )}
    </div>
  );
}

export default Dashboard;
