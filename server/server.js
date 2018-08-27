const express = require('express');
const path = require('path');
const fs = require('fs');
const querystring = require('querystring');
const axios = require('axios');
const codestitchGen = require('./codestitch/codestitchGen.js');
const { clientId, clientSecret } = require('./zoom/zoomSecret.js');

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

const redirect_uri = 'http://lvh.me:3033/zoomCode';
const zoomTokenUrl = path.join(__dirname, 'zoom', 'zoomRefreshToken.txt');

const getOrRefreshToken = async (code, get = true) => {
  const authHeader = 'Basic ' + new Buffer(clientId + ':' + clientSecret).toString('base64');
  const queryParams = {
    grant_type: get ? 'authorization_code' : 'refresh_token',
    [get ? 'code' : 'refresh_token']: code,
  };
  if (get) { queryParams.redirect_uri = redirect_uri; }
  const { data: { access_token, refresh_token } } = await axios.post(
    'https://zoom.us/oauth/token',
    querystring.stringify(queryParams),
    { headers: { "Authorization": authHeader } }
  );
  fs.writeFile(zoomTokenUrl, refresh_token, () => {});
  return access_token;
};

app.get('/zoom', async (req, res) => {
  try {
    const refreshCode = fs.readFileSync(zoomTokenUrl, 'utf8');
    const token = await getOrRefreshToken(refreshCode, false);
    res.send(token);
  } catch (err) { // This is the first auth, so there's no refresh token
    const queryParams = {
      response_type: 'code',
      client_id: clientId,
      redirect_uri,
    };
    const qs = querystring.stringify(queryParams);
    // You can't use res.redirect() in AJAX calls, so you have to redirect client-side.
    res.status(303).send('https://zoom.us/oauth/authorize?' + qs);
  }
});

app.get('/zoomCode', async (req, res) => {
  const token = await getOrRefreshToken(req.query.code);
  res.redirect(`/?access_token=${token}`);
});

app.listen(PORT, () => {
    console.log('Listening on port', PORT);
});
