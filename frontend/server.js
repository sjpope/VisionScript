// server.js
// npm start
// The red dot represents where the system believes you are looking on the screen at that moment.

const express = require('express'); // web server
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const axios = require('axios'); 
const app = express();

const PORT = 3000;

app.use(express.static('public'));
app.use(bodyParser.json());

let sessionData = [];
let sessionId = 0;

app.post('/data', (req, res) => {
  try {
    const { sessionId, data } = req.body;

    if (!sessionData[sessionId] || sessionId === 0) {
      console.error(`Session ID ${sessionId} does not exist.`);
      return res.status(400).send('Session does not exist');
    }

    if (data) {
      sessionData[sessionId].data.push(data);
      // console.log(`Data pushed to session ${sessionId}:`, data);
    }

    res.status(200).send('Data received');
  } catch (error) {
    console.error('Error processing data:', error);
    res.status(500).send('Error processing data');
  }
});

app.post('/start', (req, res) => {
  const task = req.body.task;
  sessionId = Date.now().toString();
  sessionData[sessionId] = { data: [], task: task };

  console.log(`Session ${sessionId} started for task: ${task}\n`);
  res.send({ message: 'Session started', sessionId: sessionId });
});

app.post('/pause', (req, res) => {
  res.send({ message: 'Session paused', sessionId: sessionId });
});

app.post('/resume', (req, res) => {
  res.send({ message: 'Session resumed', sessionId: sessionId });
});

app.post('/end', async (req, res) => {

  if (sessionData[sessionId]) {
    const task = sessionData[sessionId].task;

    try {

      if (sessionData[sessionId].data.length > 0) { sessionData[sessionId].data.forEach((entry, index) => { console.log(`Entry ${index} Timestamp: ${entry.timestamp}`); }); } 

      const response = await axios.post('http://localhost:5080/Core/process', {
        sessionId: sessionId,
        task: sessionData[sessionId].task,
        data: sessionData[sessionId].data
      });

      const processedData = response.data;

      res.send({
        message: 'Session ended and data processed',
        sessionId: sessionId,
        task: task,
        metrics: processedData.metrics,
        cognitiveLoad: processedData.cognitiveLoad,
        fixations: processedData.fixations,
        saccades: processedData.saccades,
      });

    } 
    catch (error) 
    {
      if (error.response) {
        console.error('Error response:', error.response.data);
        console.error('Error status:', error.response.status);
        console.error('Error headers:', error.response.headers);
      } else if (error.request) {
        console.error('Error request:', error.request);
      } else {
        console.error('Error message:', error.message);
      }
      res.status(500).send('Error processing data');
    }
  } 
  else 
  {
    console.log('No session data to process\n');
    res.status(400).send('No session data to process');
  }
  sessionId = 0;
});

app.get('/results/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  const processedDataPath = path.join(__dirname, `session-${sessionId}-processed.json`);
  
  if (fs.existsSync(processedDataPath)) {
    const processedData = JSON.parse(fs.readFileSync(processedDataPath, 'utf-8'));
    res.json(processedData);
  } else {
    res.status(404).send('Session results not found.');
  }
});

app.listen(PORT, () => {
  console.log(`I think the server is running on http://localhost:${PORT}`);
});