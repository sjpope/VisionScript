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
  
  const data = req.body.data;
  if (data && sessionId !== 0) {
    sessionData[sessionId].data.push(data);
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

    // Save the raw data
    // const dataFilePath = path.join(__dirname, 'data');
    // const sessionJsonPath = path.join(dataFilePath, `session-${sessionId}-raw.json`);
    // fs.writeFileSync(dataFilePath, JSON.stringify(sessionData[sessionId]));

    try {
      // Send data to the C# backend service
      console.log('\nPRIOR TO POST CALL:\n\n' + sessionData[sessionId].data);
      const response = await axios.post('http://localhost:5080/Core/process', sessionData[sessionId].data);

      // Get the processed data
      const processedData = response.data;

      // HEY !!!!!!!!!!!!
      // SAVE THE PROCESS DATA ON C# BACKEND NOT HERE
      // fs.writeFileSync(`session-${sessionId}-processed.json`, JSON.stringify(processedData));

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
      console.error('Error processing data:', error.message);
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