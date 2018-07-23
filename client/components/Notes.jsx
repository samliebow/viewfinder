import React, { Component } from 'react';
import SectionTitle from './SectionTitle';
const { countHP, formatNotes } = require('./noteFns');

// ({ show, toggleShow, text, horsepower, autonomy, handleKeyDown, handleNoteChange })
class Notes extends Component {
  state = {
    text: '',
    autonomy: 0,
    horsepower: 0,
    show: true,
    relativeTimeStart: null
  };

  handleKeyDown = event => {
    if (!event.shiftKey && event.keyCode === 13) {
      let text = event.target.value;

      let cursorLocation = event.target.selectionEnd;
      let { autonomy, horsepower } = countHP(text);

      this.setState({ autonomy, horsepower });
      event.target.value = formatNotes(
        text,
        cursorLocation,
        this.state.relativeTimeStart
      );
    }
  };

  handleNoteChange = event => {
    this.setState({ text: event.target.value });
  };

  toggleShow = () => {
    this.setState({ show: !this.state.show });
  };

  toggleTimer = () => {
    this.setState({
      relativeTimeStart: this.state.relativeTimeStart ? null : Date.now()
    });
  };

  render() {
    const { text, horsepower, autonomy, show, relativeTimeStart } = this.state;

    return (
      <div className="Notes">
        <h4 onClick={this.toggleShow}>Notes</h4>
        {this.state.show ?
          <span>
            <span>
              &nbsp; Autonomy: {autonomy}&nbsp; Horsepower: {horsepower}
              <button id="timer" onClick={this.toggleTimer}>
                {relativeTimeStart ? 'Stop' : 'Start'} relative timestamping
              </button>
              <textarea
                onKeyDown={this.handleKeyDown}
                onChange={this.handleNoteChange}
              />
            </span>

          </span> :
          <span>
            &nbsp;...
          </span>
        }
      </div>
    );
  }
}

export default Notes;
