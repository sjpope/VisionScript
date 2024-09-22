// public/js/main.js

window.onload = async function () {
    // Initialize WebGazer
    await webgazer
      .setRegression('ridge')
      .setGazeListener(function (data, clock) {
        if (data) {
          // You can handle gaze data here if needed
        }
      })
      .begin();
  
    webgazer.showVideoPreview(true).showPredictionPoints(true);
  
    // Set up the canvas for calibration
    const setup = function () {
      const canvas = document.getElementById('plotting_canvas');
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      canvas.style.position = 'fixed';
    };
    setup();
  
    // Show instructions and start calibration
    PopUpInstruction();
  };
  
  window.onbeforeunload = function () {
    webgazer.end();
  };
  
  /**
   * Document load event.
   */
  function docLoad() {
    ClearCanvas();
    helpModalShow();
  
    // Add click event listeners to calibration points
    document.querySelectorAll('.Calibration').forEach((i) => {
      i.addEventListener('click', () => {
        calPointClick(i);
      });
    });
  }
  
  window.addEventListener('load', docLoad);
  
  /**
   * Show help modal.
   */
  function helpModalShow() {
    swal({
      title: 'Welcome',
      text: 'Please calibrate the eye tracker by clicking on the calibration points.',
      buttons: {
        confirm: true,
      },
    });
  }
  