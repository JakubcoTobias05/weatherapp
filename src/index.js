import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import axios from 'axios';

axios.defaults.baseURL = 'http://portfolio.xf.cz:8080/tasks/IoT_WeatherApp/backend/api/';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
