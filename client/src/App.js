import React, { useState } from 'react';

import Calibration from './components/Calibration';
import ControlPanel from './components/ControlPanel';
import Results from './components/Results';
import Log from './components/Log';
import sendLog from './Utility.js';
import './App.css';

function App() {
  const [sessionId, setSessionId] = useState(null);
  const { isSessionActive, currentSessionId, updateSessionData } = useContext(SessionContext);

  useEffect(() => {

    const pullWebGazer = () => {

      sendLog('Pulling WebGazer...\n\n');

      return new Promise((resolve, reject) => {
        if (window.webgazer) {
          resolve(window.webgazer);
        } else {
          const script = document.createElement("script");
          script.src = "https://webgazer.cs.brown.edu/webgazer.js";
          script.async = true;
          script.onload = () => resolve(window.webgazer);
          script.onerror = () => reject("Failed to load webgazer.js");
          document.head.appendChild(script);
        }
      });
    };

    const initializeWebGazer = async () => {
      try {
        const webgazer = await pullWebGazer();
        webgazer.setRegression('ridge')
          .setGazeListener((data, timestamp) => {
            if (data && isSessionActive) {
              const body = JSON.stringify({
                sessionId: currentSessionId, 
                data: { x: data.x, y: data.y, timestamp: timestamp.toFixed(2) }
              });
              fetch('http://localhost:5000/data', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body
              });
            }
          })
          .begin()
          .then(() => {
            webgazer.showVideoPreview(true).showPredictionPoints(true);
            makeVideoFeedDraggable();
          });
      } catch (error) {
        console.error("WebGazer loading error:", error);
      }
    };

    initializeWebGazer();

    return () => {
      if (window.webgazer) {
        window.webgazer.end();
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
