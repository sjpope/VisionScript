// public/js/main.js
window.onload = function () {
  webgazer.setRegression('ridge').setGazeListener(function (data, clock) {
  });

  // setupCanvas();
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

function updateCharts(data) {
  const fixationCtx = document.getElementById('fixationDurationChart').getContext('2d');
  const saccadeCtx = document.getElementById('saccadeAmplitudeChart').getContext('2d');

  // Check if charts already exist, destroy if they do
  if (window.fixationChart) {
      window.fixationChart.destroy();
  }
  if (window.saccadeChart) {
      window.saccadeChart.destroy();
  }

  // Create new charts
  window.fixationChart = new Chart(fixationCtx, {
      type: 'line', // or 'bar' based on preference
      data: {
          labels: data.map((session, index) => `Session ${index + 1}`),
          datasets: [{
              label: 'Total Fixation Duration',
              data: data.map(session => session.totalFixationDuration),
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 1
          }, {
              label: 'Average Fixation Duration',
              data: data.map(session => session.averageFixationDuration),
              backgroundColor: 'rgba(54, 162, 235, 0.2)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1
          }]
      },
      options: {
          scales: {
              y: {
                  beginAtZero: true
              }
          }
      }
  });

  window.saccadeChart = new Chart(saccadeCtx, {
      type: 'line', // or 'bar' based on preference
      data: {
          labels: data.map((session, index) => `Session ${index + 1}`),
          datasets: [{
              label: 'Total Saccade Amplitude',
              data: data.map(session => session.totalSaccadeAmplitude),
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1
          }, {
              label: 'Average Saccade Amplitude',
              data: data.map(session => session.averageSaccadeAmplitude),
              backgroundColor: 'rgba(153, 102, 255, 0.2)',
              borderColor: 'rgba(153, 102, 255, 1)',
              borderWidth: 1
          }]
      },
      options: {
          scales: {
              y: {
                  beginAtZero: true
              }
          }
      }
  });
}

