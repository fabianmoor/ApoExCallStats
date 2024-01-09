import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [userData, setUserData] = useState([]);
  const [totalCalls, setTotalCalls] = useState(0);

  const fetchData = () => {
    fetch('https://flask-apo-call-219529a50172.herokuapp.com/get_all_calls')
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
  };

   useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://flask-apo-call-219529a50172.herokuapp.com/get_all_calls');
        if (!response.ok) {
          throw new Error('Network response was not ok.');
        }

        const data = await response.json();
        // Process and update state similar to your existing code

      } catch (error) {
        console.error('Error fetching user call data:', error);
      }
    };

    const intervalId = setInterval(() => {
      fetchData(); // Fetch data at intervals
    }, intervalTime);

    // Clear interval on component unmount to prevent memory leaks
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array to run useEffect only once on mount

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
