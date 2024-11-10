// server.js
// npm start
// The red dot represents where the system believes you are looking on the screen at that moment.

const express = require('express'); // web server
const bodyParser = require('body-parser'); // for parsing JSON
const fs = require('fs'); // for writing to a file
const path = require('path');
const axios = require('axios'); // for making requests to the backend
const app = express();

const PORT = 3000;

app.use(express.static('public'));
app.use(bodyParser.json());

// app.get('/', (req, res) => {
//   res.sendFile(__dirname + '/public/index.html');
// });

// app.post('/data', (req, res) => {
//   const { data } = req.body;
//   fs.appendFileSync('eyeData.txt', JSON.stringify(data) + '\n');
//   res.status(200).send('Data received');
// });


let sessionData = [];
let sessionId = 0;

app.post('/data', (req, res) => {

  const {data} = req.body;
  
  if (!sessionData[sessionId]) {
    console.error(`Session ID ${sessionId} does not exist.`);
    return res.status(400).send('Session does not exist');
  }

  if (data && sessionId !== 0) {
    sessionData[sessionId].data.push(data);
    console.log(`Data pushed to session ${sessionId}:`, data);
  }

  res.status(200).send('Data received');

});

app.post('/start', (req, res) => {
  const task = req.body.task;
  sessionId++;
  sessionData[sessionId] = { data: [], task: task };
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
      // Send data to the C# backend service
      console.log('\nPRIOR TO POST CALL:\n\n' + sessionData[sessionId].data);
      const response = await axios.post('http://localhost:5080/Core/process', sessionData[sessionId].data);

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