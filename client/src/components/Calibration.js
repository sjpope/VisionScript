import React, { useState, useEffect } from 'react';
import swal from 'sweetalert';
import './Calibration.css';

function Calibration() {
  const [pointCalibrate, setPointCalibrate] = useState(0);
  const [calibrationPoints, setCalibrationPoints] = useState({});

  const clearCanvas = () => {
    const canvas = document.getElementById('plotting_canvas');
    if (canvas) {
      const context = canvas.getContext('2d');
      context.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const showCalibrationPoint = () => {
    document.querySelectorAll('.Calibration').forEach((element) => {
      element.style.display = 'block';
    });
    document.getElementById('Pt5').style.display = 'none';
  };

  const calPointClick = (id) => {
    const newCount = (calibrationPoints[id] || 0) + 1;
    setCalibrationPoints(prev => ({ ...prev, [id]: newCount }));
    
    if (newCount === 5) {
      document.getElementById(id).style.backgroundColor = 'yellow';
      document.getElementById(id).disabled = true;
      setPointCalibrate(prev => prev + 1);
    } else {
      const opacity = 0.2 * newCount + 0.2;
      document.getElementById(id).style.opacity = opacity;
    }

    if (pointCalibrate === 8) {
      document.getElementById('Pt5').style.display = 'block';
    }

    if (pointCalibrate >= 9) {
      document.querySelectorAll('.Calibration').forEach((element) => {
        element.style.display = 'none';
      });
      document.getElementById('Pt5').style.display = 'block';
      clearCanvas();

      // const canvas = document.getElementById('plotting_canvas');
      // if (canvas) {
        // canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
      // }
      
      // calcAccuracy();
    }
  };

  useEffect(() => {
    // Optionally initialize webgazer or other setups here
  }, []);

  const handleStartCalibration = () => {
    swal({
      title: "Calibration",
      text: "Please click on each of the 9 points on the screen. You must click on each point 5 times until it turns yellow. This will calibrate your eye movements.",
      button: "Start",
    }).then(() => {
      showCalibrationPoint();
    });
  };

  return (
    <div>
      <button onClick={handleStartCalibration}>Start Calibration</button>
      <div id="CalibrationDiv" style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
        {Array.from({ length: 9 }, (_, i) => (
          <button
            key={`Pt${i + 1}`}
            id={`Pt${i + 1}`}
            className="Calibration"
            onClick={() => calPointClick(`Pt${i + 1}`)}
            style={{ width: '30px', height: '30px', backgroundColor: 'red', opacity: 0.2, margin: '5px' }}
          >
            Point {i + 1}
          </button>
        ))}
      </div>
      <canvas id="plotting_canvas" width="1280" height="720" style={{ position: 'fixed', top: 0, left: 0 }}></canvas>
    </div>
  );
}

export default Calibration;
