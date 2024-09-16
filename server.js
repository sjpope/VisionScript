// npm start

const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();

const PORT = 3000;

app.use(express.static('public'));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.post('/data', (req, res) => {
  const { data } = req.body;
  fs.appendFileSync('eyeData.txt', JSON.stringify(data) + '\n');
  res.status(200).send('Data received');
});

app.listen(PORT, () => {
  console.log(`I think the server is running on http://localhost:${PORT}`);
});