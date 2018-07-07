import React, { Component } from 'react';
import Notes from './Notes';
import Prompt from './Prompt';
import Setup from './Setup';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: {
        prompt: true
      },
      promptSrc: ''
    };

    this.setRoom = this.setRoom.bind(this);
    this.toggleShow = this.toggleShow.bind(this);
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

        <Notes />
      </div>
    );
  }
}

export default App;
