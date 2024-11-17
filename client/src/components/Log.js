// src/components/Log.js

import React, { useState, useEffect } from 'react';

const Log = ({ sessionId }) => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const handleNewData = async () => {
      if (!sessionId) {
        setLogs([]);
        return;
      }

      const response = await fetch(`/results/${sessionId}`);
      const data = await response.json();
      setLogs(data); // Assuming the backend returns an array of log entries
    };

    handleNewData();
  }, [sessionId]);

  return (
    <div id="log" style={{ height: '200px', overflowY: 'scroll', border: '1px solid #ccc', padding: '10px', marginTop: '20px' }}>
      <h2>Log</h2>
      {logs.map((log, index) => (
        <p key={index}>{`X: ${log.x}, Y: ${log.y}, Timestamp: ${log.timestamp}`}</p>
      ))}
    </div>
  );
};

export default Log;
