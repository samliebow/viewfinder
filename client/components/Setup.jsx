import React, { Component } from 'react';
import moment from 'moment';
import ReactMarkdown from 'react-markdown';
import SectionTitle from './SectionTitle';
import TlkioScript from './TlkioScript';
import LinkRenderer from './LinkRenderer';
import './Setup.css';

const Input = ({ name, setter, value }) => (
  <input
    placeholder={name}
    value={value}
    onChange={event => {
      setter(event.target.value, name);
    }}
  />
);

// { show, toggleShow, setRoom, links }
class Setup extends Component {
  state = {
    show: true
  };

  // setName = candidateName => {
  //   this.setState({ candidateName });
  // };

  // setRoom = (value, name) => {
  //   this.setState({
  //     rooms: { ...this.state.rooms, [name]: value }
  //   });
  // };

  toggleShow = () => {
    this.setState({ show: !this.state.show });
  };

  render() {
    const candidateName = this.props.candidateName || 'FIRST LAST';
    const currentDate = moment().format('YYYY-MM-DD');

    const steps = `
1. Go to [the tlk.io link](${this.props.rooms.tlkio}) for the interview.
2. Follow the steps outlined in the [TI Workflow.](https://docs.google.com/document/d/18AJkthUSgu40QUYwQNdQ3B23SIFMVSU5HDr_5bVaCws/edit)
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
          {this.props.startTime ? 
            <div> Hi {this.props.loggedIn}! Your interview with {this.props.candidateName} starts at {this.props.startTime.format('h:mm')}. 
            <br />(Not {this.props.loggedIn}? <a href='#' onClick={this.props.logout}>Click here.</a>)
            </div> :
            <div> {this.props.loggedIn ? 'Fetching data...' : `You're not logged in.`} </div> }
          <ReactMarkdown source={steps} renderers={{ link: LinkRenderer }} />
          <Input name="codestitch" setter={this.setRoom} />
          <Input name="tlkio" setter={this.setRoom} value={this.props.rooms.tlkio}/>
          <Input name="zoom" setter={this.setRoom} />
          <TlkioScript
            tlkio={this.props.rooms.tlkio}
            codestitch={this.props.rooms.codestitch}
            zoom={this.props.rooms.zoom}
            name={this.props.candidateName}
            email={this.props.candidateEmail}
            startTime={this.props.startTime}
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
