import React, { useState } from 'react';

import Calibration from './components/Calibration';
import ControlPanel from './components/ControlPanel';
import Results from './components/Results';
import WebGazerInit from './components/WebGazerInit';
import Log from './components/Log';
import './App.css';

function App() {
  const [sessionId, setSessionId] = useState(null);

  return (
    <div className="App">
      <h1>VisionScript</h1>
      <h2>Cognitive Code Console</h2>
      <WebGazerInit />
      <ControlPanel onSessionChange={setSessionId} />
      <Results sessionId={sessionId} />
      <Log sessionId={sessionId} />
      <Calibration />
      
    </div>
  );
}

export default App;
