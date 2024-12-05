// Calibration.js

import React, { useState, useEffect, useRef } from 'react';
import swal from 'sweetalert';
import './Calibration.css';

function Calibration({ onCalibrationComplete }) {
  const [pointCalibrate, setPointCalibrate] = useState(0);
  const [calibrationPoints, setCalibrationPoints] = useState({});
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [showCalibrationPoints, setShowCalibrationPoints] = useState(false);
  const calibrationRef = useRef({});

  useEffect(() => {
    // Initialize WebGazer if not already initialized
    const webgazer = window.webgazer;
    if (!webgazer.isReady()) {
      webgazer.setRegression('ridge')
        .setTracker('clmtrackr')
        .begin();
    }
  }, []);

  const clearCanvas = () => {
    const canvas = document.getElementById('plotting_canvas');
    if (canvas) {
      const context = canvas.getContext('2d');
      context.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const showCalibrationPoint = () => {
    setShowCalibrationPoints(true);
    document.getElementById('Pt5').style.display = 'none';
  };

  const calPointClick = (id) => {
    const webgazer = window.webgazer;
    const newCount = (calibrationRef.current[id] || 0) + 1;
    calibrationRef.current[id] = newCount;

    // Update UI
    const pointElement = document.getElementById(id);
    if (newCount === 5) {
      pointElement.style.backgroundColor = 'yellow';
      pointElement.disabled = true;
      setPointCalibrate((prev) => prev + 1);
    } else {
      const opacity = 0.2 * newCount + 0.2;
      pointElement.style.opacity = opacity;
    }

    // Record a point for calibration in WebGazer
    webgazer.recordScreenPosition(pointElement.offsetLeft + pointElement.offsetWidth / 2, pointElement.offsetTop + pointElement.offsetHeight / 2);

    if (pointCalibrate + 1 === 8) {
      document.getElementById('Pt5').style.display = 'block';
    }

    if (pointCalibrate + 1 >= 9) {
      // Calibration is complete
      setShowCalibrationPoints(false);
      clearCanvas();
      calculateAccuracy();
    }
  };

  const handleStartCalibration = () => {
    swal({
      title: 'Calibration',
      text: 'Please click on each of the 9 points on the screen. You must click on each point 5 times until it turns yellow. This will calibrate your eye movements.',
      button: 'Start',
    }).then(() => {
      setIsCalibrating(true);
      showCalibrationPoint();
    });
  };

  const calculateAccuracy = () => {
    const webgazer = window.webgazer;
    swal({
      title: 'Calculating measurement',
      text: "Please don't move your mouse & stare at the middle dot for the next 5 seconds. This will allow us to calculate the accuracy of our predictions.",
      closeOnEsc: false,
      closeOnClickOutside: false,
      buttons: false,
      timer: 6000,
    }).then(() => {
      // Collect data for accuracy calculation
      webgazer.showVideo(false);
      webgazer.showFaceOverlay(false);
      webgazer.showFaceFeedbackBox(false);

      const past50 = webgazer.getStoredPoints();
      const precision = calculatePrecision(past50);

      swal({
        title: `Your accuracy measure is ${precision}%`,
        buttons: {
          cancel: 'Recalibrate',
          confirm: 'Accept',
        },
      }).then((isConfirm) => {
        if (isConfirm) {
          // Save the model
          webgazer.saveDataAcrossSessions(true);
          swal('Calibration complete!', 'You can now use the application.', 'success');
          if (onCalibrationComplete) onCalibrationComplete();
          setIsCalibrating(false);
        } else {
          // Reset calibration
          resetCalibration();
        }
      });
    });
  };

  const calculatePrecision = (past50Array) => {
    const windowHeight = window.innerHeight;
    const windowWidth = window.innerWidth;

    const x50 = past50Array[0];
    const y50 = past50Array[1];

    const staringPointX = windowWidth / 2;
    const staringPointY = windowHeight / 2;

    const precisionPercentages = [];

    for (let x = 0; x < x50.length; x++) {
      const xDiff = staringPointX - x50[x];
      const yDiff = staringPointY - y50[x];
      const distance = Math.sqrt(xDiff * xDiff + yDiff * yDiff);

      const halfWindowHeight = windowHeight / 2;
      let precision = 0;
      if (distance <= halfWindowHeight && distance > -1) {
        precision = 100 - (distance / halfWindowHeight) * 100;
      } else if (distance > halfWindowHeight) {
        precision = 0;
      } else if (distance > -1) {
        precision = 100;
      }
      precisionPercentages.push(precision);
    }

    const precisionAvg = precisionPercentages.reduce((a, b) => a + b, 0) / precisionPercentages.length;
    return Math.round(precisionAvg);
  };

  const resetCalibration = () => {
    // Reset calibration data
    calibrationRef.current = {};
    setPointCalibrate(0);
    setCalibrationPoints({});
    setShowCalibrationPoints(true);

    // Reset UI
    document.querySelectorAll('.Calibration').forEach((element) => {
      element.style.backgroundColor = 'red';
      element.style.opacity = 0.2;
      element.disabled = false;
    });
  };

  return (
    <div id="CalibrationComponent">
      {!isCalibrating && (
        <button onClick={handleStartCalibration} id="startCalibrationButton">
          Start Calibration
        </button>
      )}

      {isCalibrating && (
        <div id="CalibrationDiv">
          {Array.from({ length: 9 }, (_, i) => (
            <button
              key={`Pt${i + 1}`}
              id={`Pt${i + 1}`}
              className="Calibration"
              onClick={() => calPointClick(`Pt${i + 1}`)}
              style={{ backgroundColor: 'red', opacity: 0.2 }}
            ></button>
          ))}
        </div>
      )}

      <canvas id="plotting_canvas" width={window.innerWidth} height={window.innerHeight} style={{ display: 'none' }}></canvas>
    </div>
  );
}

export default Calibration;
