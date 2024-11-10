// public/js/precision_calculation.js

/**
 * Start storing gaze data.
 */
function store_points_variable() {
    webgazer.params.storingPoints = true;
  }
  
  /**
   * Stop storing gaze data.
   */
  function stop_storing_points_variable() {
    webgazer.params.storingPoints = false;
  }
  
  /**
   * Calculate precision of the eye tracker.
   */
  function calculatePrecision(past50Array) {
    const windowHeight = window.innerHeight;
    const windowWidth = window.innerWidth;
  
    const x50 = past50Array[0];
    const y50 = past50Array[1];
  
    const staringPointX = windowWidth / 2;
    const staringPointY = windowHeight / 2;
  
    const precisionPercentages = new Array(50);
    calculatePrecisionPercentages(
      precisionPercentages,
      windowHeight,
      x50,
      y50,
      staringPointX,
      staringPointY
    );
    const precision = calculateAverage(precisionPercentages);
  
    return Math.round(precision);
  }
  
  function calculatePrecisionPercentages(
    precisionPercentages,
    windowHeight,
    x50,
    y50,
    staringPointX,
    staringPointY
  ) {
    for (let x = 0; x < 50; x++) {
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
  
      precisionPercentages[x] = precision;
    }
  }
  
  function calculateAverage(precisionPercentages) {
    let precision = 0;
    for (let x = 0; x < 50; x++) {
      precision += precisionPercentages[x];
    }
    precision = precision / 50;
    return precision;
  }
  
  /**
   * Calculate accuracy after calibration.
   */
  function calcAccuracy() {
    swal({
      title: 'Calculating measurement',
      text: "Please don't move your mouse & stare at the middle dot for the next 5 seconds. This will allow us to calculate the accuracy of our predictions.",
      closeOnEsc: false,
      allowOutsideClick: false,
      closeModal: true,
    }).then(() => {
      store_points_variable();
  
      sleep(5000).then(() => {
        
        stop_storing_points_variable();
        const past50 = webgazer.getStoredPoints();
        const precision_measurement = calculatePrecision(past50);
        const accuracyLabel =
          '<a>Accuracy | ' + precision_measurement + '%</a>';
        document.getElementById('CalibrationAccuracy').innerHTML = accuracyLabel;

        swal({
          title: 'Your accuracy measure is ' + precision_measurement + '%',
          allowOutsideClick: false,
          buttons: {
            cancel: 'Recalibrate',
            confirm: true,
          },
        }).then((isConfirm) => {

          if (isConfirm) 
          {
            ClearCanvas();
            document.getElementById('CalibrationAccuracy').innerHTML = precision_measurement + '%';
          } 
          else 
          {
            document.getElementById('CalibrationAccuracy').innerHTML =
              '<a>Not yet Calibrated</a>';
            webgazer.clearData();
            ClearCalibration();
            ClearCanvas();
            ShowCalibrationPoint();
          }

        });
      });
    });

    // Show controlPanel after calibration is complete
    document.getElementById('controlPanel').style.display = 'block';
  }
  
  /**
   * Sleep function.
   */
  function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }
  