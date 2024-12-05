import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ScatterController,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Scatter } from 'react-chartjs-2';
import './Results.css';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ScatterController,
  Title,
  Tooltip,
  Legend
);

function Results({ results }) {
  console.log('Results data:', results);

  const {
    sessionId,
    task,
    metrics,
    cognitiveLoad,
    fixations = [],
    saccades = [],
  } = results || {};

  console.log('Metrics data:', metrics);

  // Ensure metrics is defined and use camelCase property names
  const {
    totalFixationDuration = 0,
    averageFixationDuration = 0,
    fixationCount = 0,
    totalSaccadeAmplitude = 0,
    averageSaccadeAmplitude = 0,
  } = metrics || {};

  // Prepare data using useMemo to prevent unnecessary re-renders
  const fixationData = useMemo(() => ({
    labels: fixations.map((fix) => fix.startTime),
    datasets: [
      {
        label: 'Fixation Duration (ms)',
        data: fixations.map((fix) => fix.duration),
        fill: false,
        backgroundColor: 'blue',
        borderColor: 'blue',
      },
    ],
  }), [fixations]);

  const saccadeData = useMemo(() => ({
    labels: saccades.map((sac) => sac.startTime),
    datasets: [
      {
        label: 'Saccade Amplitude (pixels)',
        data: saccades.map((sac) => sac.amplitude),
        fill: false,
        backgroundColor: 'red',
        borderColor: 'red',
      },
    ],
  }), [saccades]);

  const fixationScatterData = useMemo(() => ({
    datasets: [
      {
        label: 'Fixation Points',
        data: fixations.map((fix) => ({ x: fix.x, y: fix.y })),
        backgroundColor: 'green',
      },
    ],
  }), [fixations]);

  const fixationOptions = useMemo(
    () => ({
      scales: {
        x: {
          title: {
            display: true,
            text: 'Time (ms)',
          },
        },
        y: {
          title: {
            display: true,
            text: 'Duration (ms)',
          },
        },
      },
    }),
    []
  );

  const saccadeOptions = useMemo(
    () => ({
      scales: {
        x: {
          title: {
            display: true,
            text: 'Time (ms)',
          },
        },
        y: {
          title: {
            display: true,
            text: 'Amplitude (pixels)',
          },
        },
      },
    }),
    []
  );

  const scatterOptions = useMemo(
    () => ({
      scales: {
        x: {
          title: {
            display: true,
            text: 'X Coordinate (pixels)',
          },
        },
        y: {
          title: {
            display: true,
            text: 'Y Coordinate (pixels)',
          },
        },
      },
    }),
    []
  );

  // Early return after hooks have been called
  if (!results || !sessionId) {
    return null;
  }

  return (
    <div id="sessionResults">
      <h2>Session Results</h2>
      <div id="results">
        <table>
          <tbody>
            <tr>
              <td>Session ID:</td>
              <td>{sessionId}</td>
            </tr>
            <tr>
              <td>Task:</td>
              <td>{task}</td>
            </tr>
            <tr>
              <td>Cognitive Load:</td>
              <td>{cognitiveLoad}</td>
            </tr>
            <tr>
              <td>Total Fixation Duration:</td>
              <td>{totalFixationDuration.toFixed(2)} ms</td>
            </tr>
            <tr>
              <td>Average Fixation Duration:</td>
              <td>{averageFixationDuration.toFixed(2)} ms</td>
            </tr>
            <tr>
              <td>Fixation Count:</td>
              <td>{fixationCount}</td>
            </tr>
            <tr>
              <td>Total Saccade Amplitude:</td>
              <td>{totalSaccadeAmplitude.toFixed(2)} pixels</td>
            </tr>
            <tr>
              <td>Average Saccade Amplitude:</td>
              <td>{averageSaccadeAmplitude.toFixed(2)} pixels</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div id="resultCharts">
        <div>
          <h3>Fixation Durations Over Time</h3>
          <Line
            key={`fixationChart-${sessionId}`}
            data={fixationData}
            options={fixationOptions}
          />
        </div>

        <div>
          <h3>Saccade Amplitudes Over Time</h3>
          <Line
            key={`saccadeChart-${sessionId}`}
            data={saccadeData}
            options={saccadeOptions}
          />
        </div>

        <div>
          <h3>Fixation Points</h3>
          <Scatter
            key={`fixationScatter-${sessionId}`}
            data={fixationScatterData}
            options={scatterOptions}
          />
        </div>
      </div>
    </div>
  );
}

export default Results;
