import moment from 'moment';
import staticTiHistory from '../../staticTiHistory';

const tiRows = staticTiHistory.split('\n').map(row => row.split(','));
const searchTiRows = email => tiRows
  .filter(([, rowEmail]) => rowEmail === (email || null)); // Avoid match on missing emails
const formatRow = row => {
  const [, , time, status, prompt] = row;
  const formattedTime = moment(time).format('MMMM Do YYYY');
  return [formattedTime, status, prompt].filter(el => el).join(', ');
};

const searchStaticTiHistory = email => searchTiRows(email).map(formatRow);
export default searchStaticTiHistory;