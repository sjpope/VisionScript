import React, { useEffect } from 'react';
import LoadScript from '../utils/LoadScript';
import './WebGazerInit.css';

/* global webgazer */
const WebGazerInit = () => {
    useEffect(() => {

      const loadWebGazer = async () => {

        try {
            await LoadScript('https://webgazer.cs.brown.edu/webgazer.js', 'webgazer-script');
    
    
            if (window.webgazer) {
              webgazer.setGazeListener((data, timestamp) => {
                if (data) {
                  const logElement = document.getElementById('log');
                  const message = `X: ${data.x.toFixed(2)}, Y: ${data.y.toFixed(2)}, Timestamp: ${timestamp.toFixed(2)}`;
                  console.log(message);
                  if (logElement) {
                    logElement.innerHTML += `${message}<br>`;
                    logElement.scrollTop = logElement.scrollHeight;
                  }
      
                  fetch('/data', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ sessionId: null, data: { x: data.x, y: data.y, timestamp: timestamp } })
                  });
                }
              }).begin().then(() => {
                repositionVideoFeed();
                webgazer.showVideoPreview(true).showPredictionPoints(true);
                makeVideoFeedDraggable();
              });
            }
        } catch (error) {
            console.error('Failed to load webgazer.js:', error);
        }
      };
  
      loadWebGazer();
      
      const repositionVideoFeed = () => {
        const videoContainer = document.getElementById('webgazerVideoContainer');
        if (videoContainer) {
          videoContainer.style.top = 'auto';
          videoContainer.style.left = '0px';
          videoContainer.style.bottom = '0px';
        }
      };
  
      const makeVideoFeedDraggable = () => {
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
      };
  

      return () => {
        if (window.webgazer) {
          window.webgazer.end();
        }
      };

    }, []);
  
    return <div>WebGazer Initialized</div>;
  };
  
  export default WebGazerInit;