
import './WebGazerInit.css';
import React, { useEffect, useState, useContext } from 'react';
import { SessionContext } from './SessionContext'; // Assume this context manages session states
import sendLog from './Utility.js';

export const pullWebGazer = () => {
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

const WebGazerInit = () => {
  const { isSessionActive, currentSessionId, updateSessionData } = useContext(SessionContext);
  
  useEffect(() => {

    const initializeWebGazer = async () => {
        try {
          const webgazer = await pullWebGazer();

          webgazer.setRegression('ridge')
            .setGazeListener((data, timestamp) => {
              if (data && isSessionActive) {
                fetch('http://localhost:5000/data', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json'
        
                    },
                    body: JSON.stringify({ sessionId: currentSessionId, data: { x: data.x, y: data.y, timestamp: timestamp.toFixed(2) } })
                  });
              }
            })
            .begin().then(() => {
                repositionVideoFeed();
                webgazer.showVideoPreview(true).showPredictionPoints(true);
                makeVideoFeedDraggable();
              });
        } catch (error) {
          console.error("WebGazer loading error:", error);
        }

        sendLog('WebGazer initialized...\n\n');
    };


    if(!window.webgazer){
        initializeWebGazer();
    }

    window.webgazer.params.videoViewerWidth = 320;
    window.webgazer.params.videoViewerHeight = 240;

    function repositionVideoFeed() {
      const videoContainer = document.getElementById('webgazerVideoContainer');
      videoContainer.style.top = 'auto';
      videoContainer.style.left = '0px';
      videoContainer.style.bottom = '0px';
    }

    function makeVideoFeedDraggable() {
        const videoFeed = document.getElementById('webgazerVideoFeed');
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
      
          function onMouseMove(event) {
            moveAt(event.pageX, event.pageY);
          }
      
          document.addEventListener('mousemove', onMouseMove);
          videoFeed.onmouseup = function () {
            document.removeEventListener('mousemove', onMouseMove);
            videoFeed.onmouseup = null;
          };
        };
      
        videoFeed.ondragstart = function () {
          return false;
        };
    }

    return () => {
      if (window.webgazer) {
        // window.webgazer.end(); // Cleanup on component unmount
      }
    };

  }, [isSessionActive, currentSessionId, updateSessionData]);

  return null; // No UI elements needed directly by this component

};

export default WebGazerInit;
