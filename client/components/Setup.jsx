import React, { Component } from 'react';
import ReactMarkdown from 'react-markdown';
import apiKey from '../../apiKey.js';
import SectionTitle from './SectionTitle';
import TlkioScript from './TlkioScript';
import LinkRenderer from './LinkRenderer';
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
    candidateEmail: '',
    rooms: {
      tlkio: '',
      codestitch: '',
      zoom: ''
    },
    show: true
  };

  componentDidMount() {
    gapi.load('client:auth2', async () => {
      await gapi.client.init({
        apiKey,
        // discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
        clientId: '695004460995-m8hbtlfkktf3d6opnafeer5j0dsbmn72.apps.googleusercontent.com',
        scope: 'https://www.googleapis.com/auth/calendar',
      });
      const GoogleAuth = gapi.auth2.getAuthInstance();
      GoogleAuth.isSignedIn.listen(this.makeAPICall);
      if (GoogleAuth.isSignedIn.get()) {
        this.makeAPICall();
      } else {
        GoogleAuth.signIn();
      }
    });
  }

  makeAPICall = async () => {
    const calendarsData = await gapi.client.request({
      path: 'https://www.googleapis.com/calendar/v3/users/me/calendarList',
    });
    const calendarId = calendarsData.result.items.filter(
      ({ summary }) => summary.includes('HiR'))[0].id;
    const interviewsData = await gapi.client.request({
      path: `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`,
      params: {
        singleEvents: true,
        orderBy: 'startTime',
        q: '#Interview Online with',
        timeMin: new Date((new Date() - 6e5)).toISOString(), // 10 minutes ago
      },
    });
    const soonestInterviewData = interviewsData.result.items[0];
    const soonestInterviewDetails = soonestInterviewData.description.split('\n').slice(0, 3);
    const [candidateName, candidateEmail, tlkioLink] = soonestInterviewDetails.map(el => el.split(': ')[1]);
    this.setName(candidateName);
    this.setState({ candidateEmail });
    this.setRoom(tlkioLink, 'tlkio');
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
