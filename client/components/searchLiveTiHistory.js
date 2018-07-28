const moment = require('moment');

const formatLiveTiRow = row => {
  const unwrappedValues = row.map(cell => cell.formattedValue);
  const time = moment(unwrappedValues[0], 'MM/DD/YYYY HH:mm:ss').format('MMMM Do YYYY');
  const status = unwrappedValues[5];
  const prompt = unwrappedValues[10];
  return [time, status, prompt].filter(el => el).join(', ');
};

const processLiveTiData = (data, email) => {
  const { result: { sheets: [sheet] } } = data;
  const { data: [{ rowData : rows }]} = sheet;
  // The sheet has a number of empty rows at the bottom,
  // which .filter would needlessly iterate through.
  const unformattedLiveTiRows = [];
  for (let i = 0; i < rows.length; i++) {
    const { values } = rows[i];
    // Empty cells are empty objects, so we can't just check truthiness.
    if (!Object.keys(values[0]).length) { // If we're past the filled rows
      break;
    }

    const rowEmail = values[4].formattedValue;
    if (rowEmail.trim() === email.trim()) { // No misleading whitespace
      unformattedLiveTiRows.push(values);
    }
  }
  return unformattedLiveTiRows.map(formatLiveTiRow);
};

const searchLiveTiHistory = async email => {
  const path = 'https://sheets.googleapis.com/v4/spreadsheets/' +
    '1ObVQGqm894fzjeM5vcG2qysYKDng4g8rtgyIwS3vJh8' +
    '?ranges=%27Form%20Responses%27&includeGridData=true';
  const data = await gapi.client.request({ path });
  const liveTiRows = processLiveTiData(data, email);
  return liveTiRows;
}

module.exports = searchLiveTiHistory;