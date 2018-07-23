import tiHistory from '../../tiHistory.js';
import moment from 'moment';

const tiRows = tiHistory.split('\n').map(row => row.split(','));
const searchTiRows = email => tiRows
  .filter(([, rowEmail]) => rowEmail === (email || null));
const formatRow = row => {
  const [, , time, status, prompt] = row;
  const formattedTime = moment(time).format('MMMM Do YYYY');
  return [formattedTime, status, prompt].filter(el => el).join(', ');
};

const decisionsUrl = 'https://docs.google.com/spreadsheets/d/1ObVQGqm894fzjeM5vcG2qysYKDng4g8rtgyIwS3vJh8/edit#gid=391982378';
const codestitchUrl = 'https://codestitch.io';
const myDriveUrl = 'https://drive.google.com/drive/my-drive';
const monthFoldersUrl = 'https://drive.google.com/drive/folders/0B5_RJCdGH93GdW1fMWMzQlg3VEE';
const tiDecisionsUrl = 'https://goo.gl/forms/IODn7sw3jtpiUq2n1';
const tiWorkflowUrl = 'https://docs.google.com/document/d/18AJkthUSgu40QUYwQNdQ3B23SIFMVSU5HDr_5bVaCws/edit';

const Steps = ({ candidateName, candidateEmail, currentDate, tlkio }) => {
  const matchingRows = searchTiRows(candidateEmail).map(formatRow);
  return (
    <ol>
      <li>Search for {candidateEmail || 'the candidate\'s email'} in the <a href={decisionsUrl}>Form Responses</a> spreadsheet.</li>
        <ul>Interviews scheduled by {candidateName || 'candidate'} before 6/27/18: 
          {matchingRows.length ? matchingRows.map(str => <li>{str}</li>) : ' None.'}
        </ul>
      <li>Choose the first prompt they haven't gotten (in order: Version Control, MRP, Book Library). Click that button below.</li>
      <li>Open up a <a href={codestitchUrl}>Codestitch</a> window, and paste the URL into the input field below.</li>
      <li>Schedule a Zoom call named <i>{candidateName || 'FIRSTNAME LASTNAME'} - {currentDate}</i> and paste the join link into the input field below.</li>
        <ul>
          <li> Make sure it's set to record automatically to the cloud. </li>
        </ul>
      <li>Go to <a href={tlkio}>the tlk.io link</a> and conduct the interview, using the script snippets below.</li>
      <li>Move the completed prompt document from <a href={myDriveUrl}>My Drive</a> to the appropriate month's folder <a href={monthFoldersUrl}>here.</a></li>
      <li>Fill out the <a href={tiDecisionsUrl}>Technical Interview Decisions Form</a>.</li>
      <li>If you have any questions, reference the <a href={tiWorkflowUrl}>TI Workflow</a></li>
    </ol>
  );
};

export default Steps;