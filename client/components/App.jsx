import React, { Component } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

const moment = require('moment');

class App extends Component {
  constructor (props) {
    super(props);
    this.state = { text: '', autonomy: 0, horsepower: 0 };

    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleCopy = this.handleKeyDown.bind(this);
  }
  

  handleKeyDown (event) {
    if (!event.shiftKey && event.keyCode === 13) {
      const text = event.target.value;

      let autonomy = 0;
      let horsepower = 0;

      for (let i = 0; i + 1 < text.length; i++) {
        if (text[i] === 'a') {
          if (text[i+1] === '+') {
            autonomy++;
          } else if (text[i+1] === '-') {
            autonomy--;
          }
        } else if (text[i] === 'h') {
          if (text[i+1] === '+') {
            horsepower++;
          } else if (text[i+1] === '-') {
            horsepower--;
          }
        }
      }

      this.setState({ autonomy, horsepower });

      let cursorLocation = event.target.selectionEnd;

      event.target.value = `${text.slice(0, cursorLocation)}\t\t[${moment().format('LTS')}]${text.slice(cursorLocation, text.length)}`;
    }
  }

  render () {
    return (
      <div className='app'>
        <span style={{ fontWeight: 'bold' }}>Interview Notes</span><br /><br />
        Autonomy: {this.state.autonomy}&nbsp; Horsepower: {this.state.horsepower} 

        <textarea
          style={{ display: 'flex' }}
          onKeyDown={this.handleKeyDown}
          onChange={(event) => { this.setState({ text: event.target.value }) }}
        />

        <CopyToClipboard text={ this.state.text } >
          <button>📋</button>
        </CopyToClipboard>
      </div>
  )};
};

export default App;