import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const App = () => {
  const [userData, setUserData] = useState([]);
  const [totalCalls, setTotalCalls] = useState(0);
  const [isLoading, setIsLoading] = useState(true); // Added loading state
  const intervalTime = 10000; // Fetch data every 10 seconds (adjust as needed)
  const fetchingData = useRef(false); // Flag to track if data is being fetched

  const fetchData = async () => {
    if (fetchingData.current) return; // Exit if already fetching data
    fetchingData.current = true; // Set flag to true when starting to fetch data

    try {
      const response = await fetch('https://flask-apo-call-219529a50172.herokuapp.com/get_all_calls');
      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }
      const data = await response.json();

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
      setIsLoading(false); // Set loading state to false after data is fetched
    } catch (error) {
      console.error('Error fetching user call data:', error);
      // Implement retry mechanism or backoff strategy here if needed
    } finally {
      fetchingData.current = false; // Reset the flag when fetch operation completes
    }
  };

  useEffect(() => {
    const fetchDataWithInterval = () => {
      fetchData(); // Fetch data immediately

      setTimeout(fetchDataWithInterval, intervalTime); // Schedule next fetch after the interval
    };

    fetchDataWithInterval();
  }, []);
  
  if (isLoading) {
    return <div>Loading...</div>; // Show loading message while data is being fetched
  }

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
