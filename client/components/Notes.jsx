import React, { Component } from 'react';
import SectionTitle from './SectionTitle';
import { countHP, formatNotes } from './noteFns';

// ({ show, toggleShow, text, horsepower, autonomy, handleKeyDown, handleNoteChange })
class Notes extends Component {
  state = {
    text: '',
    autonomy: 0,
    horsepower: 0,
    show: true
  };

  handleKeyDown = event => {
    if (!event.shiftKey && event.keyCode === 13) {
      let text = event.target.value;

      let cursorLocation = event.target.selectionEnd;
      let { autonomy, horsepower } = countHP(text);

      this.setState({ autonomy, horsepower });
      event.target.value = formatNotes(text, cursorLocation);
    }
  };

  handleNoteChange = event => {
    this.setState({ text: event.target.value });
  };

  toggleShow = () => {
    this.setState({ show: !this.state.show });
  };

  render() {
    const { text, horsepower, autonomy, show } = this.state;

    return (
      <div className="Notes" style={{ marginBottom: '2em' }}>
        <SectionTitle
          title="Notes"
          sectionName="notes"
          toggleShow={this.toggleShow}
        />
        <span style={{ display: this.state.show ? 'inline' : 'none' }}>
          - Autonomy: {autonomy}&nbsp; Horsepower: {horsepower}
          <textarea
            style={{
              display: 'flex',
              height: '10em',
              width: 'calc(100% - .5em + 1px)'
            }}
            onKeyDown={this.handleKeyDown}
            onChange={this.handleNoteChange}
          />
        </span>
        <div style={{ display: this.state.show ? 'none' : 'inline-block' }}>
          &nbsp;...{' '}
        </div>
      </div>
    );
  }
}

export default Notes;
