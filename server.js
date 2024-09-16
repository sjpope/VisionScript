// npm start
// The red dot represents where the system believes you are looking on the screen at that moment.
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
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

app.post('/start', (req, res) => {
  sessionId++;
  sessionData[sessionId] = [];
  res.send({ message: 'Session started', sessionId: sessionId });
});

app.post('/data', (req, res) => {
  const data = req.body.data;
  if (data && sessionId !== 0) {
    sessionData[sessionId].push(data);
  }
  res.status(200).send('Data received');
});

app.post('/pause', (req, res) => {
  res.send({ message: 'Session paused', sessionId: sessionId });
});

app.post('/end', (req, res) => {
  if (sessionData[sessionId]) {
    fs.writeFileSync(`session-${sessionId}.txt`, JSON.stringify(sessionData[sessionId]));
    res.send({ message: 'Session ended and data saved', sessionId: sessionId });
  } else {
    res.status(400).send('No session data to save');
  }
  sessionId = 0;
});


app.listen(PORT, () => {
  console.log(`I think the server is running on http://localhost:${PORT}`);
});