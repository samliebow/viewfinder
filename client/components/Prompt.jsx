import React, { Component } from 'react';
import SectionTitle from './SectionTitle';

class Prompt extends Component {
  state = {
    show: true,
    source: ''
  };

  setSource = source => {
    this.setState({ source });
  };

  toggleShow = () => {
    this.setState({ show: !this.state.show });
  };

  render() {
    const { show, source } = this.state;
    const {
      loggedIn,
      copyPrompt,
      promptUrl,
      promptSelected,
    } = this.props;

    return (
      <div>
        <SectionTitle
          title="Prompt"
          sectionName="prompt"
          toggleShow={this.toggleShow}
        />
        {show ? 
          <div>
            <input
              placeholder={"Google Drive prompt link"}
              defaultValue={promptUrl}
              style={{ width: '100%' }}
              onKeyDown={event => {
                if (event.keyCode === 13) {
                  this.setSource(event.target.value);
                }
              }}
            />
          {loggedIn && !promptSelected ? 
            ['Version Control', 'MRP', 'Book Library'].map(prompt => (
            <button id={prompt} key={prompt} onClick={copyPrompt}>
              Use {prompt}
            </button>)) 
            : (promptSelected && !promptUrl ? 'Please wait, prompt loading...' : null)}
            <span>
              <iframe
                style={{
                  height: '60%',
                  width: '100%'
                }}
                src={source || promptUrl}
              />
            </span>
          </div> :
          <span>
            &nbsp;...
          </span>
        }
      </div>
    );
  }
}

export default Prompt;
