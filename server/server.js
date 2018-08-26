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
    const urlFile = path.join(__dirname, 'codestitch', 'codestitchUrl.txt')
    url = fs.readFileSync(urlFile, 'utf8');
    fs.unlink(urlFile, () => codestitchGen(email, password));
  } catch (err) { // If there isn't a preexisting codestitchUrl file
    url = await codestitchGen(email, password, true);
    codestitchGen(email, password);
  }
  res.send(url);
});

app.listen(PORT, () => {
  console.log('Listening on port', PORT);
})