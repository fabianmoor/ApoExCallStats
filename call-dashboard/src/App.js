import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';
import https from 'https';

const insecureAgent = new https.Agent({ rejectUnauthorized: false });

const App = () => {
  const [userData, setUserData] = useState([]);
  const [totalCalls, setTotalCalls] = useState(0);
  const intervalTime = 10000;

  const fetchData = async () => {
    try {
      const response = await axios.get('https://ec2-13-48-59-20.eu-north-1.compute.amazonaws.com/get_all_calls', {
        headers: {
          'Content-Type': 'application/json',
        },
        httpsAgent: insecureAgent,
      });

      const data = response.data;

      const usersData = Object.entries(data).map(([name, calls]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1).toLowerCase(),
        calls: calls
      }));

      const total = usersData.reduce((accumulator, currentValue) => accumulator + currentValue.calls, 0);

      const usersWithPercentage = usersData.map(user => ({
        ...user,
        percentage: total !== 0 ? ((user.calls / total) * 100).toFixed(2) : 0
      }));

      // Only update state if fetched data is different from current state
      if (JSON.stringify(usersWithPercentage) !== JSON.stringify(userData)) {
        setUserData(usersWithPercentage);
      }
      if (total !== totalCalls) {
        setTotalCalls(total);
      }
    } catch (error) {
      console.error('Error fetching user call data:', error);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, intervalTime);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="App">
      <h1>ApoEx User Stats</h1>
      <div className="bubbles-container">
        {userData.map((user, index) => (
          <div className="bubble" key={index}>
            <div>{user.name}</div>
            <div>{user.calls}</div>
            <div>{user.percentage}%</div>
          </div>
        ))}
        {totalCalls !== 0 && <div className="total-calls">Total Calls: {totalCalls}</div>}
      </div>
    </div>
  );
};

export default App;