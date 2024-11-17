import React from 'react';

function Results() {
  return (
    <div id="sessionResults">
    <h2>Session Results</h2>

    <select id="sessionSelector">
       {/* <!-- ????? -->
       <!-- Should read from backend/data/processed and populate drop down --> */}
    </select>

    <div id="resultCharts">
      <canvas id="fixationDurationChart"></canvas>
      <canvas id="saccadeAmplitudeChart"></canvas>
    </div>

    <div id="results">
      <p>Session ID: <span id="sessionId"></span></p>
      <p>Task: <span id="selectedTask"></span></p>
      <p>Total Fixation Duration: <span id="totalFixationDuration"></span></p>
      <p>Average Fixation Duration: <span id="averageFixationDuration"></span></p>
      <p>Fixation Count: <span id="fixationCount"></span></p>
      <p>Total Saccade Amplitude: <span id="totalSaccadeAmplitude"></span></p>
      <p>Average Saccade Amplitude: <span id="averageSaccadeAmplitude"></span></p>
      <p>Cognitive Load: <span id="cognitiveLoad"></span></p>
    </div>

  </div>
  );
}

export default Results;
