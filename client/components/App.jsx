import React, { Component } from 'react';
import Notes from './Notes';
import Prompt from './Prompt';
import Setup from './Setup';

const { countHP, formatNotes } = require('./noteFns');

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
      autonomy: 0,
      horsepower: 0,
      show: {
        prompt: true,
        notes: true
      },
      promptSrc: ''
    };

    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleCopy = this.handleKeyDown.bind(this);
    this.setRoom = this.setRoom.bind(this);
    this.toggleShow = this.toggleShow.bind(this);
  }

  handleKeyDown(event) {
    if (!event.shiftKey && event.keyCode === 13) {
      let text = event.target.value;

      let cursorLocation = event.target.selectionEnd;
      let { autonomy, horsepower } = countHP(text);

      this.setState({ autonomy, horsepower });
      event.target.value = formatNotes(text, cursorLocation);
    }
  }

  setRoom(room, value) {
    this.setState({
      links: {
        ...this.state.links,
        [room]: value
      }
    });
  }

  toggleShow(section) {
    this.setState({
      show: Object.assign(this.state.show, {
        [section]: !this.state.show[section]
      })
    });
  }

  render() {
    return (
      <div
        className="app"
        style={{ padding: '2em', height: 'calc(100vh - 4em)' }}
      >
        <h1
          style={{
            fontSize: 24,
            margin: '0 0 .5em 0',
            padding: 0
          }}
        >
          HR Interview Noter
        </h1>

        <Setup />

        <Prompt
          show={this.state.show.prompt}
          toggleShow={this.toggleShow}
          promptSrc={this.state.promptSrc}
          setPromptSrc={promptSrc => {
            this.setState({ promptSrc });
          }}
        />
        <hr
          style={{ display: this.state.show.prompt ? 'inline-block' : 'none' }}
        />

        <Notes
          show={this.state.show.notes}
          toggleShow={this.toggleShow}
          text={this.state.text}
          autonomy={this.state.autonomy}
          horsepower={this.state.horsepower}
          handleKeyDown={this.handleKeyDown}
          handleNoteChange={event => {
            this.setState({ text: event.target.value });
          }}
        />
      </div>
    );
  }
}

export default App;
