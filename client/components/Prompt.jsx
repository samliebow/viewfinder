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

    return (
      <span>
        <SectionTitle
          title="Prompt"
          sectionName="prompt"
          toggleShow={this.toggleShow}
        />
        <span>
          <input
            placeholder={"Google Drive prompt link"}
            defaultValue={this.props.promptUrl}
            style={{
              display: show ? 'block' : 'none',
              width: '100%'
            }}
            onKeyDown={event => {
              if (event.keyCode === 13) {
                this.setSource(event.target.value);
              }
            }}
          />
        </span>
        {this.props.promptButtonsShown ? 
          ['Version Control', 'MRP', 'Book Library'].map(prompt => (
          <button id={prompt} key={prompt} onClick={this.props.copyPrompt}>
            Use {prompt}
          </button>)) 
          : (this.props.promptUrl ? null : 'Please wait, prompt loading...')}
        <span>
          <iframe
            style={{
              display: show ? 'block' : 'none',
              height: '60%',
              width: '100%'
            }}
            src={source || this.props.promptUrl}
          />
        </span>
        <div style={{ display: show ? 'none' : 'inline-block' }}>
          &nbsp;...{' '}
        </div>
      </span>
    );
  }
}

export default Prompt;
