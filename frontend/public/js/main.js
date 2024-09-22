// public/js/main.js

window.onload = async function () {
    await webgazer.setRegression('ridge').setGazeListener(function (data, clock) {
      if (data) {
        const logElement = document.getElementById('log');
        const message = `X: ${data.x.toFixed(2)}, Y: ${data.y.toFixed(2)}, Time: ${clock}`;
        logElement.innerHTML += `<div>${message}</div>`;
        logElement.scrollTop = logElement.scrollHeight;
      }
    }).begin();
    
    webgazer.showVideoPreview(true).showPredictionPoints(true);
    setupCanvas();
    makeVideoFeedDraggable(); // Ensure video feed is draggable
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
  
  function setupCanvas() {
    const canvas = document.getElementById('plotting_canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.position = 'fixed';
  }
  
  function makeVideoFeedDraggable() {
    const videoFeed = document.getElementById('webgazerVideoFeed');
    videoFeed.style.position = 'fixed';
    videoFeed.style.cursor = 'move';
    videoFeed.onmousedown = function(event) {
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
      videoFeed.onmouseup = function() {
        document.removeEventListener('mousemove', onMouseMove);
        videoFeed.onmouseup = null;
      };
    };
  
    videoFeed.ondragstart = function() {
      return false;
    };
  }
  