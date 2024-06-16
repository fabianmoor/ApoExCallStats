import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [userData, setUserData] = useState([]);
  const [totalCalls, setTotalCalls] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const intervalTime = 10000;

  const fetchData = async () => {
    /*setIsLoading(true);*/
    try {
      const response = await fetch('https://flask-apo-call-219529a50172.herokuapp.com/get_all_calls');
      /*const response = await fetch('http://13.53.35.91:8000/get_all_calls')*/
      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }
      const data = await response.json();

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

      /*setIsLoading(false);*/
    } catch (error) {
      console.error('Error fetching user call data:', error);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, intervalTime);
    return () => clearInterval(interval);
  }, []);

  /*if (isLoading) {
    return <div>Loading...</div>;
  }*/

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