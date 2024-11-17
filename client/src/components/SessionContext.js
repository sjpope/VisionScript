import React, { createContext, useState } from 'react';

export const SessionContext = createContext();

export const SessionProvider = ({ children }) => {
    
  const [isSessionActive, setSessionActive] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [sessionData, setSessionData] = useState({});

  const startSession = (sessionId) => {
    setCurrentSessionId(sessionId);
    setSessionActive(true);
    setSessionData({ ...sessionData, [sessionId]: [] });
  };

  const updateSessionData = (sessionId, data, timestamp) => {
    const currentData = sessionData[sessionId] || [];
    currentData.push({ data, timestamp });
    setSessionData({ ...sessionData, [sessionId]: currentData });
  };

  const pauseSession = () => setSessionActive(false);
  const resumeSession = () => setSessionActive(true);
  const endSession = () => {
    setSessionActive(false);
    setCurrentSessionId(null);
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
