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
      <div className='app' style={{ padding: '2em' }}>
        <span style={{ fontWeight: 'bold' }}>Interview Notes</span> - Autonomy: {this.state.autonomy}&nbsp; Horsepower: {this.state.horsepower} 

        <textarea
          style={{
            display: 'flex',
            height: '10em',
            width: 'calc(100% - .5em + 1px)'
          }}
          onKeyDown={this.handleKeyDown}
          onChange={(event) => { this.setState({ text: event.target.value }) }}
        />

        <CopyToClipboard text={ this.state.text }>
          <button style={{ float: 'right', width: '6em' }}>📋</button>
        </CopyToClipboard>

        <ul>
          <li><a href="https://drive.google.com/open?id=1yzyEviXgBXeAMRPoUVPutafJuSotGv9c72PgqHIU70o" target="_blank" >Prompts ⇗</a></li>
          <li><a href="https://google.com/calendar" target="_blank">Calendar ⇗</a></li>
          <li><a href="https://hackreactorcore.force.com/hackreactor" target="_blank">Salesforce ⇗</a></li>
          <li><a href="https://codestitch.io" target="_blank">Codestitch ⇗</a></li>
        </ul>

        On tlk.io
        <div style={{ border: '1px solid black', padding: '.5em .5em .5em .5em' }}>
          <pre style={{ whiteSpace: 'pre-wrap', margin: 0 }}>
            Hi - if you are present, please input your name in the field below and press enter to join the chat. Then post a message so I know you’re here!<br />
            -<br />
            Hi! We’ll get started in just a few minutes. To get us started, can you please write your name and email in a comment in this codestitch.io pad? ___LINK___HERE__<br />
            -<br />
            (5 minutes no-show): (substituting _refID_ as you did above): Hi - It is currently time for your technical interview and we have been waiting for you. Please connect with us by going to the following URL: tlk.io/_refID_<br />
            -<br />
            Here’s the link to our video room: ___URL___HERE___. Once you have Zoom downloaded please click the link to join.

          </pre>
        </div>
      </div>
  )};
};

export default App;