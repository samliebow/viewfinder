// Derived from https://github.com/kjng/codestitch-creator - which another HiR made!
const fs = require('fs');
const path = require('path');
const nightmare = require('nightmare')();
const { email, password } = require('./codestitchCredentials.js');

const generateUrl = async () => {
  let wait = 1000;
  let url;
  let atLogin = false;
  let atPad = false;
  while (!atLogin && wait <= 3000) {
    url = await nightmare
      .goto('https://codestitch.io/auth/sign_in')
      .type('#user_email', email)
      .type('#user_password', password)
      .click('input[value="Sign in"]')
      .wait(wait)
      .url();
    wait += 1000;
    atLogin = url === 'https://codestitch.io/pads';
  }
  if (!atLogin) {
    throw new Error(`Couldn't log in.`);
  }

  wait = 500;
  while (!atPad && wait < 3000) {
    url = await nightmare
      .goto('https://codestitch.io/pads/new')
      .wait(wait)
      .url();
    wait += 1500;
    atPad = !!url.match(/[a-z0-9]{8}$/)
  }
  if (!atPad) {
    throw new Error(`Couldn't get to pad.`);
  }

  fs.writeFile(path.join(__dirname, 'codestitchUrl.txt'), url, 
    () => console.log('New Codestitch URL generated.'));
};

module.exports = generateUrl;