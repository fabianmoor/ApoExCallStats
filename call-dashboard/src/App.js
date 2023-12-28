import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [userData, setUserData] = useState([]);
  const [totalCalls, setTotalCalls] = useState(0);

  useEffect(() => {
    fetch('http://127.0.0.1:5000/get_all_calls')
      .then((response) => response.json())
      .then((data) => {
        const usersData = Object.entries(data).map(([name, calls]) => ({
          name: name.charAt(0).toUpperCase() + name.slice(1).toLowerCase(),
          calls: calls
        }));

        const total = usersData.reduce((accumulator, currentValue) => accumulator + currentValue.calls, 0);
        setTotalCalls(total);

        const usersWithPercentage = usersData.map(user => ({
          ...user,
          percentage: total !== 0 ? ((user.calls / total) * 100).toFixed(2) : 0
        }));

        setUserData(usersWithPercentage);
      })
      .catch((error) => {
        console.error('Error fetching user call data:', error);
      });
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
