import React, { Component } from 'react';
import Notes from './Notes';
import Prompt from './Prompt';
import Setup from './Setup';
import apiKey from '../../apiKey.js';

class App extends Component {
  state = {
    candidateName: '',
    candidateEmail: '',
    rooms: {
      tlkio: '',
      codestitch: '',
      zoom: ''
    },
    promptUrl: '',
  };

  componentDidMount() {
    gapi.load('client:auth2', async () => {
      const scopes = [
        'https://www.googleapis.com/auth/calendar', 
        'https://www.googleapis.com/auth/drive',
        ];
      await gapi.client.init({
        apiKey,
        // discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
        clientId: '695004460995-m8hbtlfkktf3d6opnafeer5j0dsbmn72.apps.googleusercontent.com',
        scope: scopes.join(' '),
      });
      this.GoogleAuth = gapi.auth2.getAuthInstance();
      this.GoogleAuth.isSignedIn.listen(this.getCalendarData);
      if (this.GoogleAuth.isSignedIn.get()) {
        this.getCalendarData();
      } else {
        this.GoogleAuth.signIn();
      }
    });
  }

  copyPrompt = async event => {
    const promptName = event.target.id;
    const promptId = {
      'Version Control': '1tTkmIotuBEP8PwvpxmTaTHKDDUCb8i0ikmTfm8D8oA4',
      'MRP': '196ClAKfTFgO8gWs3O57QGcddVnWiS9RNtAXpVuEcrxU',
      'Book Library': '1dDybGPnNcNr3kE9rJMB-_MmQAtFCTujCFauD0KrPNfY',
    }[promptName];
    const copyMetadata = await gapi.client.request({
      path: `https://www.googleapis.com/drive/v3/files/${promptId}/copy`,
      method: 'POST',
      body: {
        name: `${this.state.candidateName} - ${this.getDateString()} - ${promptName}`,
        parents: ['root'],
      },
    });
    const copyId = copyMetadata.result.id;
    const publishPromise = gapi.client.request({
      path: `https://www.googleapis.com/drive/v3/files/${copyId}/revisions/1`,
      method: 'PATCH',
      body: { 
        published: true,
        publishAuto: true,
        publishedOutsideDomain: true,
      },
    });
    const editPromise = gapi.client.request({
      path: `https://www.googleapis.com/drive/v3/files/${copyId}/permissions`,
      method: 'POST',
      body: {
        role: 'writer',
        type: 'anyone',
        allowFileDiscovery: false,
      },
    });
    await Promise.all([publishPromise, editPromise]);
    const promptUrl = `https://docs.google.com/document/d/${copyId}/edit?usp=sharing`;
    this.setState({ promptUrl });
  };

  getCalendarData = async () => {
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
    this.setState({ candidateName });
    this.setState({ candidateEmail });
    this.setState({ rooms: Object.assign({}, this.state.rooms, { tlkio: tlkioLink }) });
  };

  getDateString = () => {
    const now = new Date();
    const strArr = [];
    strArr.push(now.getFullYear());
    strArr.push(`${now.getMonth() + 1}`.padStart(2, '0'));
    strArr.push(now.getDate());
    return strArr.join('-');
  };


  render() {
    return (
      <div className="app" style={{ padding: '2em', height: 'calc(100vh - 4em)' }}>
        <h1
          style={{
            fontSize: 24,
            margin: '0 0 .5em 0',
            padding: 0
          }}
        >
          HR Interview Noter
        </h1>

        <Setup 
          candidateName={this.state.candidateName}
          candidateEmail={this.state.candidateEmail}
          rooms={this.state.rooms}
        />

        <Prompt 
          copyPrompt={this.copyPrompt}
          promptUrl={this.state.promptUrl}
        />

        <Notes />
      </div>
    );
  }
};

export default App;
