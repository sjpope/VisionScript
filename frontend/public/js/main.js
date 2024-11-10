// public/js/main.js
window.onload = function () {
  webgazer.setRegression('ridge').setGazeListener(function (data, clock) {
  });

  setupCanvas();
  makeVideoFeedDraggable(); 
};

window.onbeforeunload = function () {
  webgazer.end();
};

function setupCanvas() {
  const canvas = document.getElementById('plotting_canvas');
  canvas.width = window.innerWidth; // Uncaught TypeError: Cannot set properties of null (setting 'width')
  canvas.height = window.innerHeight;
  canvas.style.position = 'fixed';
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

// function startCalibration() {
//   ClearCanvas();
//   helpModalShow(); // Show calibration instructions

//   // Add click event listeners to calibration points
//   document.querySelectorAll('.Calibration').forEach((i) => {
//     i.addEventListener('click', () => {
//       calPointClick(i);
//     });
//   });
// }
