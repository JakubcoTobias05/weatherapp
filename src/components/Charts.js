import React, { useEffect, useState } from 'react';
import { Chart } from 'react-google-charts';
import axios from 'axios';

function Charts() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get('dashboard.php')
      .then((res) => {
        const chartData = [['Čas', 'Teplota']];
        res.data.forEach((row) => {
          const time = new Date(row.cas_mereni).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          chartData.push([time, parseFloat(row.teplota)]);
        });
        setData(chartData);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="chart-section">
      <div className="chart-header">Graf teploty</div>
      <div className="chart-body">
        {data.length > 1 ? (
          <Chart
            chartType="LineChart"
            data={data}
            options={{
              title: 'Průběh teploty',
              curveType: 'function',
              legend: { position: 'bottom' },
            }}
            width="100%"
            height="400px"
          />
        ) : <p>Načítám data...</p>}
      </div>
    </div>
  );
}

export default Charts;
