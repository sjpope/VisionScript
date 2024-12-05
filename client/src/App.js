import React, { useEffect, useRef, useContext } from 'react';
import Calibration from './components/Calibration';
import ControlPanel from './components/ControlPanel';
import Results from './components/Results';
import Log from './components/Log';
import { SessionContext } from './components/SessionContext';
import './App.css';

function App() {
  const { isSessionActive, currentSessionId, sessionResults } = useContext(SessionContext);
  const isSessionActiveRef = useRef(isSessionActive);
  const currentSessionIdRef = useRef(currentSessionId);
  const webgazerInitialized = useRef(false);

  // Update refs when session state changes
  useEffect(() => {
    isSessionActiveRef.current = isSessionActive;
    currentSessionIdRef.current = currentSessionId;
  }, [isSessionActive, currentSessionId]);

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
    

    if (!webgazerInitialized.current) {
      webgazerInitialized.current = true;
      window.webgazer
        .setRegression('ridge')
        .setGazeListener((data, timestamp) => {
          if (data) {
            const logElement = document.getElementById('log');
            const message = `X: ${data.x.toFixed(
              2
            )}, Y: ${data.y.toFixed(2)}, Timestamp: ${timestamp.toFixed(2)}`;

            // Send gaze data to the server if a session is active
            if (isSessionActiveRef.current && currentSessionIdRef.current) {

              if (logElement) {
                logElement.innerHTML += message + '<br>';
                logElement.scrollTop = logElement.scrollHeight;
              }

              fetch(`http://localhost:5000/data`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  sessionId: currentSessionIdRef.current,
                  data: { x: data.x, y: data.y, timestamp: timestamp.toFixed(2) },
                }),
              });
            }
          }
        })
        .begin()
        .then(() => {
          repositionVideoFeed();
          window.webgazer.showVideoPreview(true).showPredictionPoints(isSessionActiveRef.current);
          makeVideoFeedDraggable();
        });
    }
  };


    loadWebGazer();

    return () => {
      // Clean up webgazer when the component unmounts
      if (window.webgazer) {
        try {
          window.webgazer.end();
          webgazerInitialized.current = false;
        } catch (error) {
          console.warn('Error during webgazer cleanup:', error);
        }
      }
    };
  }, []); // Empty dependency array to run once

  useEffect(() => {
    if (window.webgazer) {
      window.webgazer.showPredictionPoints(isSessionActive);
    }
  }, [isSessionActive]);

  const makeVideoFeedDraggable = () => {
    const videoContainer = document.getElementById('webgazerVideoContainer');
    if (videoContainer) {
      videoContainer.style.position = 'fixed';
      videoContainer.style.cursor = 'move';

      let isDragging = false;
      let offsetX = 0;
      let offsetY = 0;

      videoContainer.addEventListener('mousedown', function (event) {
        isDragging = true;
        offsetX = event.clientX - videoContainer.offsetLeft;
        offsetY = event.clientY - videoContainer.offsetTop;
      });

      document.addEventListener('mousemove', function (event) {
        if (isDragging) {
          videoContainer.style.left = event.clientX - offsetX + 'px';
          videoContainer.style.top = event.clientY - offsetY + 'px';
        }
      });

      document.addEventListener('mouseup', function () {
        isDragging = false;
      });
    }
  };

  function repositionVideoFeed() {
    const videoContainer = document.getElementById('webgazerVideoContainer');
    if (videoContainer) {
      videoContainer.style.top = 'auto';
      videoContainer.style.left = '0px';
      videoContainer.style.bottom = '0px';
    }
  }

  return (
    <div className="App">
      <header>
        <h1>VisionScript</h1>
        <h2>Cognitive Code Console</h2>
        <ControlPanel />
      </header>
      <main>
        <Calibration />
        {sessionResults && <Results results={sessionResults} />}
        <Log sessionId={currentSessionId} />
      </main>
    </div>
  );
}

export default App;
