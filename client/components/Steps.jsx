const decisionsUrl = 'https://docs.google.com/spreadsheets/d/1ObVQGqm894fzjeM5vcG2qysYKDng4g8rtgyIwS3vJh8/edit#gid=391982378';
const codestitchUrl = 'https://codestitch.io';
const myDriveUrl = 'https://drive.google.com/drive/my-drive';
const monthFoldersUrl = 'https://drive.google.com/drive/folders/0B5_RJCdGH93GdW1fMWMzQlg3VEE';
const tiDecisionsUrl = 'https://goo.gl/forms/IODn7sw3jtpiUq2n1';
const tiWorkflowUrl = 'https://docs.google.com/document/d/18AJkthUSgu40QUYwQNdQ3B23SIFMVSU5HDr_5bVaCws/edit';

const Steps = ({ candidateName, candidateEmail, currentDate, tlkio, staticTiRows, liveTiRows, suggestedPrompt, copyPrompt, }) => (
  <ol>
    <li>Records for {candidateEmail || 'the candidate\'s email'} in the <a href={decisionsUrl} target="_blank">Technical Interview Decisions</a> spreadsheet:</li>
      {staticTiRows ?
        <ul>Interviews scheduled by {candidateName.split(' ')[0] || 'candidate'} before 6/27/18:
          {staticTiRows.length ? staticTiRows.map(str => <li key={str}>{str}</li>) : ' None.'}
        </ul>
      : null }
      {liveTiRows ?
        <ul>Interviews scheduled by {candidateName.split(' ')[0] || 'candidate'} since 6/27/18:
          {liveTiRows.length ? liveTiRows.map(str => <li key={str}>{str}</li>) : ' None.'}
        </ul>
      : null}
      {suggestedPrompt ? 
        <ul>It looks like they haven't used {suggestedPrompt}.&nbsp; 
          <a href="#" id={suggestedPrompt} onClick={copyPrompt}>
              Use {suggestedPrompt}
          </a>, or choose a prompt below. It will save to this month's folder.
        </ul>
        : null }
    <li>Open up a <a href={codestitchUrl} target="_blank">Codestitch</a> pad and paste the URL below.</li>
    <li>Schedule a Zoom call named <i>{candidateName || 'FIRSTNAME LASTNAME'} - {currentDate}</i> and paste the join link below.</li>
    <li>Go to <a href={tlkio} target="_blank">the tlk.io link</a> and conduct the interview using the script snippets below.</li>
    <li>Fill out the <a href={tiDecisionsUrl} target="_blank">Technical Interview Decisions Form</a>.</li>
    <li>If you have any questions, reference the <a href={tiWorkflowUrl} target="_blank">TI Workflow</a>.</li>
  </ol>
);

export default Steps;