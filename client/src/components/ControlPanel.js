import React, { useState, useCallback, useContext } from 'react';
import { SessionContext } from './SessionContext';
import './ControlPanel.css';

const ControlPanel = ({ onSessionChange }) => {
    const [task, setTask] = useState('development');
    const [sessionActive, setSessionActive] = useState(false);
  
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
        <button onClick={() => startSession(task)}>Start Session</button>
        <button onClick={pauseSession}>Pause Session</button>
        <button onClick={resumeSession}>Resume Session</button>
        <button onClick={endSession}>End Session</button>
        <span id="Accuracy">Not yet Calibrated</span>
      </div>

    );

  };
  
  export default ControlPanel;