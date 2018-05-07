import React from 'react';
import SectionTitle from './SectionTitle';
import TlkioScript from './TlkioScript';

const Setup = ({ show, toggleShow, setRoom, links }) => (
  <div className="setup">
    <SectionTitle title='Setup' sectionName='setup' toggleShow={toggleShow} />
    <div style={{ display: show ? 'block' : 'none' }}>
      <ul>

        <li>
          1. Go to tlk.io link in <a href="https://google.com/calendar" target="_blank">Google Calendar ⇗</a></li>
        <li>
          2. View applicant in <a href="https://hackreactorcore.force.com/hackreactor" target="_blank">Salesforce ⇗</a>
        </li>
        <li>
          3. Pick a prompt that applicant has not been given before. <a href="https://drive.google.com/drive/u/2/folders/0B5_RJCdGH93GdGpKcGx1YVBXVWs" target="_blank" >Prompts ⇗</a></li>
        <li>
          4. Open up CodeStitch window. <a href="https://codestitch.io" target="_blank">Codestitch ⇗</a></li>
        <li> 5. Schedule a Zoom call with the following format: 'FIRSTNAME LASTNAME - {(new Date).toISOString().slice(0, 10)}'.
          <ul><li>Make sure it's set to record automatically to the cloud.</li></ul>
        </li>
      </ul>         
    
      <input placeholder="codestitch.io" onChange={(event) => {setRoom('codestitch', event.target.value)}}/>
      <input placeholder="tlk.io" onChange={(event) => {setRoom('tlkio', event.target.value)}} />
      <input placeholder="zoom" onChange={(event) => {setRoom('zoom', event.target.value)}} />

      <div style={{ border: '1px solid black', padding: '.5em .5em .5em .5em' }}>          
        <TlkioScript tlkio={ links.tlkio } codestitch={ links.codestitch } zoom={ links.zoom } />
      </div> <br />
    </div>
    <div style={{ display: show ? 'none' : 'inline-block' }}>&nbsp;... </div>
  </div>
);

export default Setup;