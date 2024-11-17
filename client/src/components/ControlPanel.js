import React, { useState, useCallback, useContext } from 'react';
import { SessionContext } from './SessionContext';
import './ControlPanel.css';

const ControlPanel = ({ onSessionChange }) => {
    const [task, setTask] = useState('development');
    const [sessionActive, setSessionActive] = useState(false);
  
    // const startSession = useCallback(async () => {
    //   const response = await fetch('/start', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ task })
    //   });
    //   const data = await response.json();
    //   onSessionChange(data.sessionId);
    //   setSessionActive(true);
    // }, [task, onSessionChange]);
  
    // const pauseSession = useCallback(async () => {
    //   await fetch('/pause', { method: 'POST' });
    //   setSessionActive(false);
    // }, []);
  
    // const resumeSession = useCallback(async () => {
    //   await fetch('/resume', { method: 'POST' });
    //   setSessionActive(true);
    // }, []);
  
    // const endSession = useCallback(async () => {
    //   await fetch('/end', { method: 'POST' });
    //   setSessionActive(false);
    //   onSessionChange(null);
    // }, [onSessionChange]);
    const { startSession, pauseSession, resumeSession, endSession } = useContext(SessionContext);

    return (

      <div id="controlPanel">
        <div id="taskSelection">
          {['development', 'code_review', 'debugging'].map((t) => (
            <label key={t}>
              <input type="radio" name="task" value={t} checked={task === t} onChange={() => setTask(t)} />
              {t}
            </label>
          ))}
        </div>
        <button onClick={() => startSession(Date.now().toString())}>Start Session</button>
      <button onClick={pauseSession}>Pause Session</button>
      <button onClick={resumeSession}>Resume Session</button>
      <button onClick={endSession}>End Session</button>
        <span id="Accuracy">Not yet Calibrated</span>
      </div>
      
    );

  };
  
  export default ControlPanel;
