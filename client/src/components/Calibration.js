import React, { useState, useEffect } from 'react';
import swal from 'sweetalert';
import './Calibration.css';

function Calibration({ onCalibrationComplete }) {
  const [pointCalibrate, setPointCalibrate] = useState(0);
  const [calibrationCounts, setCalibrationCounts] = useState({});
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [hidePt5, setHidePt5] = useState(true);
  const [showMiddleDot, setShowMiddleDot] = useState(false);

  useEffect(() => {
    // Initialize WebGazer
    const webgazer = window.webgazer;
    if (!webgazer.isReady()) {
      webgazer.setRegression('ridge')
        .setTracker('clmtrackr')
        .begin()
        .showPredictionPoints(true)
        .showVideoPreview(true)
        .showFaceOverlay(true)
        .showFaceFeedbackBox(true);
    } else {
      webgazer.showPredictionPoints(true);
    }
  }, []);

  useEffect(() => {
    if (isCalibrating) {
      setHidePt5(true);
    }
  }, [isCalibrating]);

  const clearCanvas = () => {
    const canvas = document.getElementById('plotting_canvas');
    if (canvas) {
      const context = canvas.getContext('2d');
      context.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const calPointClick = (id) => {
    const webgazer = window.webgazer;
    const newCount = (calibrationCounts[id] || 0) + 1;
    setCalibrationCounts((prevCounts) => ({ ...prevCounts, [id]: newCount }));

    // Record calibration point
    const pointElement = document.getElementById(id);
    if (pointElement) {
      webgazer.recordScreenPosition(
        pointElement.offsetLeft + pointElement.offsetWidth / 2,
        pointElement.offsetTop + pointElement.offsetHeight / 2
      );
    }

    // Update calibration progress
    if (newCount === 5) {
      setPointCalibrate((prev) => {
        const newPointCalibrate = prev + 1;

        if (newPointCalibrate === 8) {
          setHidePt5(false); // Show middle point
        }

        if (newPointCalibrate >= 9) {
          setIsCalibrating(false);
          clearCanvas();
          calculateAccuracy();
        }

        return newPointCalibrate;
      });
    }
  };

  const handleStartCalibration = () => {
    swal({
      title: 'Calibration',
      text: 'Please click on each of the 9 points on the screen...',
      button: 'Start',
    }).then(() => {
      setCalibrationCounts({});
      setPointCalibrate(0);
      setIsCalibrating(true);
    });
  };

  const calculateAccuracy = () => {
    const webgazer = window.webgazer;
    webgazer.clearData();

    swal({
      title: 'Calculating measurement',
      text: "Please click 'Start' when you're ready...",
      button: 'Start',
      allowOutsideClick: false,
      allowEscapeKey: false,
    }).then(() => {
      setShowMiddleDot(true); // Show the middle dot
      webgazer.params.storingPoints = true;
      webgazer.showPredictionPoints(true);

      setTimeout(() => {
        setShowMiddleDot(false); // Hide the middle dot
        webgazer.params.storingPoints = false;

        // Proceed with accuracy calculation
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
            webgazer.saveDataAcrossSessions(true);
            swal('Calibration complete!', 'You can now use the application.', 'success');
            if (onCalibrationComplete) onCalibrationComplete();
            setIsCalibrating(false);
          } else {
            resetCalibration();
          }
        });
      }, 5000); // 5-second timer
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
    setCalibrationCounts({});
    setPointCalibrate(0);
    setHidePt5(true);
    setIsCalibrating(true);
    const webgazer = window.webgazer;
    webgazer.clearData();
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
          {Array.from({ length: 9 }, (_, i) => {
            const ptId = `Pt${i + 1}`;
            const isPt5 = ptId === 'Pt5';
            const isHidden = isPt5 && hidePt5;
            const count = calibrationCounts[ptId] || 0;
            const isCalibrated = count >= 5;
            const opacity = Math.min(1, 0.2 * count + 0.2);
            const backgroundColor = isCalibrated ? 'yellow' : 'red';

            return (
              <button
                key={ptId}
                id={ptId}
                className="Calibration"
                onClick={() => calPointClick(ptId)}
                style={{ backgroundColor, opacity, display: isHidden ? 'none' : 'block' }}
                disabled={isCalibrated}
              ></button>
            );
          })}
        </div>
      )}

      {showMiddleDot && (
        <div
          id="middleDot"
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            width: '20px',
            height: '20px',
            backgroundColor: 'red',
            borderRadius: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 1000,
          }}
        ></div>
      )}

      <canvas id="plotting_canvas" width={window.innerWidth} height={window.innerHeight} style={{ display: 'none' }}></canvas>
    </div>
  );
}

export default Calibration;
