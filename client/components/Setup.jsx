import React, { Component } from 'react';
import ReactMarkdown from 'react-markdown';
import SectionTitle from './SectionTitle';
import TlkioScript from './TlkioScript';
import './Setup.css';

const Input = ({ name, setter }) => (
  <input
    placeholder={name}
    onChange={event => {
      setter(event.target.value, name);
    }}
  />
);

// { show, toggleShow, setRoom, links }
class Setup extends Component {
  state = {
    candidateName: '',
    rooms: {
      tlkio: '',
      codestitch: '',
      zoom: ''
    },
    show: true
  };

  setName = candidateName => {
    this.setState({ candidateName });
  };

  setRoom = (value, name) => {
    this.setState({
      rooms: { ...this.state.rooms, [name]: value }
    });
  };

  toggleShow = () => {
    this.setState({ show: !this.state.show });
  };

  render() {
    const candidateName = this.state.candidateName || 'FIRST LAST';
    const currentDate = new Date().toISOString().slice(0, 10);

    const steps = `
1. Go to tlk.io link in [Google Calendar](https://google.com/calendar)
2. Follow the steps outlined in the [TI Workflow](https://docs.google.com/document/d/18AJkthUSgu40QUYwQNdQ3B23SIFMVSU5HDr_5bVaCws/edit)
    * You'll need to make a copy of the document and rename it to: \`${candidateName} - ${currentDate} - PROMPT NAME\`
3. Open up a [Codestitch](https://codestitch.io) window.
4. Schedule a Zoom call with the following format: \`${candidateName} - ${currentDate}\`
    * Make sure it's set to record automatically to the cloud.`;

    return (
      <div className="setup">
        <SectionTitle
          title="Setup"
          sectionName="setup"
          toggleShow={this.toggleShow}
        />
        <div style={{ display: this.state.show ? 'block' : 'none' }}>
          <Input name="candidate name" setter={this.setName} />
          <ReactMarkdown source={steps} renderers={{ link: LinkRenderer }} />
          <Input name="codestitch" setter={this.setRoom} />
          <Input name="tlkio" setter={this.setRoom} />
          <Input name="zoom" setter={this.setRoom} />
          <TlkioScript
            tlkio={this.state.rooms.tlkio}
            codestitch={this.state.rooms.codestitch}
            zoom={this.state.rooms.zoom}
          />
        </div>
        <div style={{ display: this.state.show ? 'none' : 'inline-block' }}>
          &nbsp;...{' '}
        </div>
      </div>
    );
  }
}

export default Setup;
