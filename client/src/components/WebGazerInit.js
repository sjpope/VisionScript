
import './WebGazerInit.css';
import React, { useEffect, useState, useContext } from 'react';
import { SessionContext } from './SessionContext'; // Assume this context manages session states

export const loadWebGazer = () => {
    return new Promise((resolve, reject) => {
      if (window.webgazer) {
        resolve(window.webgazer); // if already loaded
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
    const loadWebGazer = async () => {
      if (window.webgazer) {
        window.webgazer.setRegression('ridge')
          .setGazeListener((data, timestamp) => {
            if (data && isSessionActive) {
              updateSessionData(currentSessionId, data, timestamp);
            }
          }).begin();

        window.webgazer.showVideoPreview(true).showPredictionPoints(true);
      }
    };

    loadWebGazer();

    return () => {
      if (window.webgazer) {
        window.webgazer.end(); // Cleanup on component unmount
      }
    };
  }, [isSessionActive, currentSessionId, updateSessionData]);

  return null; // No UI elements needed directly by this component
};

export default WebGazerInit;
