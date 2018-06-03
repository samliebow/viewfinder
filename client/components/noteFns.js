const moment = require('moment');

const countHP = (text) => {
  let autonomy = 0;
  let horsepower = 0;

  for (let i = 0; i + 1 < text.length; i++) {
    if (text[i] === 'a' || text[i] === 'A') {
      if (text[i+1] === '+') {
        autonomy++;
      } else if (text[i+1] === '-') {
        autonomy--;
      }
    } else if (text[i] === 'h' || text[i] === 'H') {
      if (text[i+1] === '+') {
        horsepower++;
      } else if (text[i+1] === '-') {
        horsepower--;
      }
    }
  }

  return { autonomy, horsepower };
};

const findLineNum = (text, cursorLocation) => {
  let count = 0;
  for (let i = 0; i < text.length && i < cursorLocation; i++) {
    if (text[i] === '\n') {
      count++;
    }
  }
  return count;
}

const formatNotes = (text, cursorLocation, relativeTimeStart) => {
  let lineNum = findLineNum(text, cursorLocation);
  text = text.split('\n');
  let time;
  if (relativeTimeStart) {
    const elapsed = moment.duration(Date.now() - relativeTimeStart);
    const [h, m, s] = [elapsed.hours(), elapsed.minutes(), elapsed.seconds()]
      .map(el => `${el}`.padStart(2, '0'));
    time = `${h}:${m}:${s}`;
  } else {
    time = moment().format('LTS');
  }
  text[lineNum] = `[${time}]: ${text[lineNum]}`
  return text.join('\n');
}


module.exports = { countHP, formatNotes };