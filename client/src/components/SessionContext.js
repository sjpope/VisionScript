import React, { createContext, useState } from 'react';

export const SessionContext = createContext();

export const SessionProvider = ({ children }) => {

  const [isSessionActive, setSessionActive] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [sessionData, setSessionData] = useState({});

  
  const updateSessionData = (sessionId, data, timestamp) => {
    if (!isSessionActive || !sessionId) return;
    const currentData = sessionData[sessionId] || [];
    currentData.push({ data, timestamp });
    setSessionData({ ...sessionData, [sessionId]: currentData });
  };

  const startSession = async (task) => {
    try {
      const response = await fetch('http://localhost:5000/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task: task })
      });
      const data = await response.json();
      if (response.ok) {
        setCurrentSessionId(data.sessionId);
        setSessionActive(true);
        setSessionData({ ...sessionData, [data.sessionId]: [] });
      } else {
        throw new Error('Failed to start session');
      }
    } catch (error) {
      console.error('Start session error:', error);
    }
  };

  const pauseSession = async () => {
    try {
      const response = await fetch('http://localhost:5000/pause', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: currentSessionId })
      });
      if (response.ok) {
        setSessionActive(false);
      } else {
        throw new Error('Failed to pause session');
      }
    } catch (error) {
      console.error('Pause session error:', error);
    }
  };

  const resumeSession = async () => {
    try {
      const response = await fetch('http://localhost:5000/resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: currentSessionId })
      });
      if (response.ok) {
        setSessionActive(true);
      } else {
        throw new Error('Failed to resume session');
      }
    } catch (error) {
      console.error('Resume session error:', error);
    }
  };

  const endSession = async () => {
    try {
      const response = await fetch('http://localhost:5000/end', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: currentSessionId })
      });
      if (response.ok) {
        setSessionActive(false);
        setCurrentSessionId(null);
      } else {
        throw new Error('Failed to end session');
      }
    } catch (error) {
      console.error('End session error:', error);
    }
  };

  return (
    <SessionContext.Provider value={{
      isSessionActive,
      currentSessionId,
      sessionData,
      startSession,
      updateSessionData,
      pauseSession,
      resumeSession,
      endSession
    }}>
      {children}
    </SessionContext.Provider>
  );
};
