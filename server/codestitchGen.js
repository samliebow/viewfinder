// Derived from https://github.com/kjng/codestitch-creator - which another HiR made!
const fs = require('fs');
const path = require('path');
const Nightmare = require('nightmare');
const { email, password } = require('./codestitchCredentials.js');

const generateUrl = async () => {
  const nightmare = Nightmare();
  let url = await nightmare
    .goto('https://codestitch.io/auth/sign_in')
    .type('#user_email', email)
    .type('#user_password', password)
    .click('input[value="Sign in"]')
    .wait('img', 2000) // Hacky way to wait until done logging in
    .url();
  if (url !== 'https://codestitch.io/pads') {
    throw new Error(`Couldn't log in.`);
  }

  url = await nightmare
    .goto('https://codestitch.io/pads/new')
    .wait('#run', 2000) // Hacky way to wait until pad created
    .url(); 
  if (!url.match(/[a-z0-9]{8}$/)) {
    throw new Error(`Couldn't get to pad.`);
  }

  // .then after .end is required
  nightmare.end(() => 'Headless browser stopped.').then(console.log.bind(console));
  fs.writeFile(path.join(__dirname, 'codestitchUrl.txt'), url, 
    () => console.log(`New Codestitch URL generated for next interview: ${url}.`));
};

module.exports = generateUrl;