const express = require('express');
const fs = require('fs');
const path = require('path');
const codestitchGen = require('./codestitch/codestitchGen.js');

const app = express();
const PORT = process.env.port || 3033;

app.use(express.static('client/dist'));

app.get('/codestitch', async (req, res) => {
  let url;
  const { email, password } = req.query;
  try {
    url = fs.readFileSync(path.join(__dirname, 'codestitch', 'codestitchUrl.txt'), 'utf8');
  } catch (err) { // If there isn't a preexisting codestitchUrl file
    url = await codestitchGen(email, password, true);
  }
  res.send(url);
  codestitchGen(email, password);
});

app.listen(PORT, () => {
  console.log('Listening on port', PORT);
})