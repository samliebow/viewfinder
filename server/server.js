const express = require('express');
const fs = require('fs');
const path = require('path');
const codestitchGen = require('./codestitchGen.js');

const app = express();
const PORT = process.env.port || 3033;

app.use(express.static('client/dist'));

app.get('/codestitch', (req, res) => {
  const url = fs.readFileSync(path.join(__dirname, 'codestitchUrl.txt'), 'utf8');
  res.send(url);
  codestitchGen();
});

app.listen(PORT, () => {
    console.log('Listening on port', PORT);
})