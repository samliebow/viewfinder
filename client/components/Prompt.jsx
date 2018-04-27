import React from 'react';
import SectionTitle from './SectionTitle'

const Prompt = ({show, toggleShow, promptSrc, setPromptSrc }) => (
  <span>
    <SectionTitle title='Prompt' sectionName='prompt' toggleShow={toggleShow} />
      <span>
        <input placeholder='Google Drive prompt link'
          defaultValue={promptSrc}
          style={{
            display: show ? 'block' : 'none',
            width: '100%'
          }}
          onKeyDown={
            (event) => {
              if (event.keyCode === 13) {
                setPromptSrc(event.target.value);
              }
        }} />
        <iframe
          style={{
            display:  show ? 'block' : 'none',
            height: '60%',
            width: '100%'
        }}
        src={promptSrc} />
      </span>
    <div style={{ display: show ? 'none' : 'inline-block' }}>&nbsp;... </div>
  </span>
);

export default Prompt;