const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const querystring = require('querystring');
const axios = require('axios');
const codestitchGen = require('./codestitch/codestitchGen.js');
const { clientId, clientSecret } = require('./zoom/zoomSecret.js');

const app = express();
const PORT = process.env.port || 3033;

app.use(express.static('client/dist'));
app.use(bodyParser.json());

<<<<<<< 7326f0bcd74c43ce206efa409ba9ae9641834346
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
=======
const getToken = async (code) => {
>>>>>>> Fix and simplify Zoom OAuth, add actual meeting creation.
  const authHeader = 'Basic ' + new Buffer(clientId + ':' + clientSecret).toString('base64');
  const queryParams = {
    grant_type: 'authorization_code',
    code,
    redirect_uri: 'http://lvh.me:3033/zoom',
  };
  const { data: { access_token } } = await axios.post(
    'https://zoom.us/oauth/token',
    querystring.stringify(queryParams),
    { headers: { "Authorization": authHeader } }
  );
  return access_token;
};

const makeMeeting = (name, time, token) => ({
  topic: name,
  type: 2,
  start_time: time,
  timezone: 'America/Los Angeles',
  settings: {
    host_video: true,
    participant_video: true,
    join_before_host: false,
    auto_recording: 'cloud',
  },
});

app.get('/zoom', async ({ query: { code} }, res) => {
  if (code) { 
    const token = await getToken(code);
    res.redirect(`/?access_token=${token}`);
  } else {
    const queryParams = {
      response_type: 'code',
      client_id: clientId,
      redirect_uri: 'http://lvh.me:3033/zoom',
    };
    const qs = querystring.stringify(queryParams);
    // You can't use res.redirect() in AJAX calls, so you have to redirect client-side.
    res.status(303).send('https://zoom.us/oauth/authorize?' + qs);
  }
});

app.post('/zoomMeeting', (req, res) => {
  const { name, time, token } = req.body;
  const meeting = makeMeeting(name, time, token);
  const Authorization = 'Bearer ' + token;
  axios.post('https://api.zoom.us/v2/users/me/meetings', meeting, { headers: { Authorization } })
    .then(({ data }) => res.status(201).send(data))
    .catch(err => {
      console.log('error', err.response.status, err.response.data);
      res.sendStatus(500);
    });
});

app.listen(PORT, () => {
  console.log('Listening on port', PORT);
});
