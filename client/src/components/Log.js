// src/components/Log.js

import React, { useState, useEffect, useContext  } from 'react';
import { SessionContext } from './SessionContext';
import './Log.css';
const Log = () => {
    const { sessionData, currentSessionId } = useContext(SessionContext);
  
    return (
      <div id="log">
        <h2>Log</h2>
        {/* {sessionData[currentSessionId]?.map((entry, index) => (
          <p key={index}>
            X: {entry.data.x.toFixed(2)}, Y: {entry.data.y.toFixed(2)}, Timestamp: {entry.timestamp.toFixed(2)}
          </p>
        ))} */}
      </div>
    );
  };
  
  export default Log;