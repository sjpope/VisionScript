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

  const {
    sessionId,
    task,
    metrics,
    cognitiveLoad,
    fixations = [],
    saccades = [],
  } = results;

  // Ensure metrics is defined
  const {
    TotalFixationDuration = 0,
    AverageFixationDuration = 0,
    FixationCount = 0,
    TotalSaccadeAmplitude = 0,
    AverageSaccadeAmplitude = 0,
  } = metrics || {};

  // Prepare data using useMemo to prevent unnecessary re-renders
  const fixationData = useMemo(() => ({
    labels: fixations.map((fix) => fix.StartTime),
    datasets: [
      {
        label: 'Fixation Duration (ms)',
        data: fixations.map((fix) => fix.Duration),
        fill: false,
        backgroundColor: 'blue',
        borderColor: 'blue',
      },
    ],
  }), [fixations]);

  const saccadeData = useMemo(() => ({
    labels: saccades.map((sac) => sac.StartTime),
    datasets: [
      {
        label: 'Saccade Amplitude (pixels)',
        data: saccades.map((sac) => sac.Amplitude),
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
        data: fixations.map((fix) => ({ x: fix.X, y: fix.Y })),
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
        <p>
          <strong>Session ID:</strong> {sessionId}
        </p>
        <p>
          <strong>Task:</strong> {task}
        </p>
        <p>
          <strong>Cognitive Load:</strong> {cognitiveLoad}
        </p>
        <p>
          <strong>Total Fixation Duration:</strong> {TotalFixationDuration.toFixed(2)} ms
        </p>
        <p>
          <strong>Average Fixation Duration:</strong> {AverageFixationDuration.toFixed(2)} ms
        </p>
        <p>
          <strong>Fixation Count:</strong> {FixationCount}
        </p>
        <p>
          <strong>Total Saccade Amplitude:</strong> {TotalSaccadeAmplitude.toFixed(2)} pixels
        </p>
        <p>
          <strong>Average Saccade Amplitude:</strong> {AverageSaccadeAmplitude.toFixed(2)} pixels
        </p>
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
