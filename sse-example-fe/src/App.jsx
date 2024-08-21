import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [stocks, setStocks] = useState({});
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const clientId = `client-${Date.now()}`;
    const eventSource = new EventSource(
      `http://localhost:3001/sse?clientId=${clientId}`
    );

    eventSource.onopen = () => {
      setConnected(true);
      console.log('SSE connection opened');
    };

    eventSource.addEventListener('stockUpdate', (event) => {
      const data = JSON.parse(event.data);
      setStocks((prevStocks) => ({
        ...prevStocks,
        [data.stock]: data.price,
      }));
    });

    eventSource.onerror = (error) => {
      console.error('SSE error:', error);
      setConnected(false);
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <div className="App">
      <h1>실시간 주식 가격</h1>
      <p>연결 상태: {connected ? '연결됨' : '연결되지 않음'}</p>
      <ul>
        {Object.entries(stocks).map(([stock, price]) => (
          <li key={stock}>
            {stock}: ${price}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
