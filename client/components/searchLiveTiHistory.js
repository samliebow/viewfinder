const moment = require('moment');

const formatLiveTiRow = row => {
  const unwrappedValues = row.map(cell => cell.formattedValue);
  const time = moment(unwrappedValues[0], 'MM/DD/YYYY HH:mm:ss').format('MMMM Do YYYY');
  const status = unwrappedValues[5];
  const prompt = unwrappedValues[10];
  const reviewerRec = unwrappedValues[13] ? `Reviewer recommendation: ${unwrappedValues[13]}` : null;
  return [time, status, prompt, reviewerRec]
    .filter(el => el).join(', '); // el => el avoids empty cells being included in the string
};

const processLiveTiData = (data, email) => {
  const { result: { sheets: [sheet] } } = data;
  const { data: [{ rowData : rows }]} = sheet;
  const unformattedLiveTiRows = rows.map(({ values }) => values).filter(values => {
    const { formattedValue: rowEmail } = values[4];
    // rowEmail && avoids problems with the many empty rows at the bottom of the sheet.
    // Each cell in an empty row is {}, so rowEmail is undefined and .trim() would error.
    return rowEmail && rowEmail.trim() === email.trim(); // Remove misleading whitespace
  });
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