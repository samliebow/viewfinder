import React from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import SectionTitle from './SectionTitle';

const Notes = ({ show, toggleShow, text, horsepower, autonomy, handleKeyDown, handleNoteChange }) => (
  <div className='Notes' style={{ marginBottom: '2em' }}>
   <SectionTitle title='Notes' sectionName='notes' toggleShow={toggleShow} />

    <span>
    - Autonomy: {autonomy}&nbsp; Horsepower: {horsepower} 

    <textarea
      style={{
        display: 'flex',
        height: '10em',
        width: 'calc(100% - .5em + 1px)',
      }}
      onKeyDown={handleKeyDown}
      onChange={handleNoteChange}
    />

    <CopyToClipboard text={ text }>
      <button style={{ float: 'right', width: '6em' }}>📋</button>
    </CopyToClipboard>
    </span>
  </div>
);

export default Notes;