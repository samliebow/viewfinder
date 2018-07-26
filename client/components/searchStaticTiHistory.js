import staticTiHistory from '../../staticTiHistory.js';

const tiRows = staticTiHistory.split('\n').map(row => row.split(','));
const searchTiRows = email => tiRows
  .filter(([, rowEmail]) => rowEmail === (email || null)); // Avoid match on missing emails
const formatRow = row => {
  const [, , time, status, prompt] = row;
  const formattedTime = moment(time).format('MMMM Do YYYY');
  return [formattedTime, status, prompt].filter(el => el).join(', ');
};

module.exports = email => searchTiRows(email).map(formatRow);