// public/js/calibration.js

let PointCalibrate = 0;
let CalibrationPoints = {};

/**
 * Clear the canvas and the calibration buttons.
 */
function ClearCanvas() {
  document.querySelectorAll('.Calibration').forEach((i) => {
    i.style.display = 'none';
  });
  const canvas = document.getElementById('plotting_canvas');
  if (canvas) {
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
  }
}

/**
 * Show calibration instructions.
 */
function PopUpInstruction() {
  ClearCanvas();
  swal({
    title: 'Calibration',
    text: 'Please click on each of the 9 points on the screen. You must click on each point 5 times till it goes yellow. This will calibrate your eye movements.',
    buttons: {
      cancel: false,
      confirm: true,
    },
  }).then((isConfirm) => {
    ShowCalibrationPoint();
  });
}

/**
 * Handle click events on calibration points.
 */
function calPointClick(node) {
  const id = node.id;

  if (!CalibrationPoints[id]) {
    CalibrationPoints[id] = 0;
  }
  CalibrationPoints[id]++;

  if (CalibrationPoints[id] == 5) {
    node.style.backgroundColor = 'yellow';
    node.disabled = true;
    PointCalibrate++;
  } else if (CalibrationPoints[id] < 5) {
    const opacity = 0.2 * CalibrationPoints[id] + 0.2;
    node.style.opacity = opacity;
  }

  if (PointCalibrate == 8) {
    document.getElementById('Pt5').style.display = 'block';
  }

  if (PointCalibrate >= 9) {
    document.querySelectorAll('.Calibration').forEach((i) => {
      i.style.display = 'none';
    });
    document.getElementById('Pt5').style.display = 'block';

    const canvas = document.getElementById('plotting_canvas');
    if (canvas) {
      canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    }

    calcAccuracy();
  }
}


/**
 * Show calibration points.
 */
function ShowCalibrationPoint() {
  document.querySelectorAll('.Calibration').forEach((i) => {
    i.style.display = 'block';
  });
  document.getElementById('Pt5').style.display = 'none';
}

/**
 * Clear calibration data.
 */
function ClearCalibration() {
  document.querySelectorAll('.Calibration').forEach((i) => {
    i.style.backgroundColor = 'red';
    i.style.opacity = '0.2';
    i.disabled = false;
  });

  CalibrationPoints = {};
  PointCalibrate = 0;
}

/**
 * Restart the calibration process.
 */
function Restart() {
  document.getElementById('Accuracy').innerHTML = '<a>Not yet Calibrated</a>';
  webgazer.clearData();
  ClearCalibration();
  helpModalShow();
}

/**
 * Start the calibration process.
 */
function startCalibration() {
  ClearCanvas();
  helpModalShow(); // Show calibration instructions

  // Add click event listeners to calibration points
  document.querySelectorAll('.Calibration').forEach((i) => {
    i.addEventListener('click', () => {
      calPointClick(i);
    });
  });
}


/**
 * Show calibration instructions.
 */
function helpModalShow() {
  swal({
    title: 'Calibration',
    text: 'Please click on each of the 9 points on the screen. You must click on each point 5 times until it turns yellow. This will calibrate your eye movements.',
    buttons: {
      cancel: false,
      confirm: true,
    },
  }).then(() => {
    ShowCalibrationPoint();
  });
}
