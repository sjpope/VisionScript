import React, { useEffect, useState, useContext } from 'react';

import Calibration from './components/Calibration';
import ControlPanel from './components/ControlPanel';
import Results from './components/Results';
import Log from './components/Log';
import {sendLog} from './components/Utility.js';
import { SessionContext } from './components/SessionContext';
import './App.css';

function App() {
  const [sessionId, setSessionId] = useState(null);
  const { isSessionActive, currentSessionId, updateSessionData } = useContext(SessionContext);
  sendLog('Pulling WebGazer...\n\n');
  
  useEffect(() => {

    const loadWebGazer = async () => {
      if (!window.webgazer) {
        const script = document.createElement('script');
        script.src = 'https://webgazer.cs.brown.edu/webgazer.js';
        script.async = true;
        document.head.appendChild(script);
        await new Promise((resolve, reject) => {
          script.onload = resolve;
          script.onerror = reject;
        });
      }
      await window.webgazer.setRegression('ridge').begin();
      window.webgazer.showVideoPreview(true).showPredictionPoints(true);
      setupWebGazerListeners();
    };

    const setupWebGazerListeners = () => {
      window.webgazer.setGazeListener((data, timestamp) => {
        if (data && isSessionActive) {
          const logMessage = `X: ${data.x.toFixed(2)}, Y: ${data.y.toFixed(2)}, Timestamp: ${timestamp.toFixed(2)}`;
          console.log(logMessage); // Also consider using sendLog if you want to keep logs elsewhere
          fetch(`http://localhost:5000/data`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({sessionId: currentSessionId, data, timestamp})
          });
        }
      });
    };

    loadWebGazer();

    return () => {
      if (window.webgazer) {
        // window.webgazer.end();
      }
    };
  }, [isSessionActive, currentSessionId]);

  const makeVideoFeedDraggable = () => {
    const videoFeed = document.getElementById('webgazerVideoFeed');
    if (videoFeed) {
      videoFeed.style.position = 'fixed';
      videoFeed.style.cursor = 'move';
      videoFeed.onmousedown = function (event) {
        event.preventDefault();
        let shiftX = event.clientX - videoFeed.getBoundingClientRect().left;
        let shiftY = event.clientY - videoFeed.getBoundingClientRect().top;
    
        function moveAt(pageX, pageY) {
          videoFeed.style.left = pageX - shiftX + 'px';
          videoFeed.style.top = pageY - shiftY + 'px';
        }
    
        document.addEventListener('mousemove', event => moveAt(event.pageX, event.pageY));
        videoFeed.onmouseup = function () {
          document.removeEventListener('mousemove', moveAt);
          videoFeed.onmouseup = null;
        };
      };
    }
  };
  
  return (
    <div className="App">
    
    
      <h1>VisionScript</h1>
      <h2>Cognitive Code Console</h2>
      <ControlPanel onSessionChange={setSessionId} />
      <Results sessionId={sessionId} />
      <Log sessionId={sessionId} />
      <Calibration />
      
    
    
    </div>
  );
}

export default App;
