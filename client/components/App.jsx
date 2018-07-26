import React, { Component } from 'react';
import moment from 'moment';
import Notes from './Notes';
import Prompt from './Prompt';
import Setup from './Setup';
import apiKey from '../../apiKey.js';
import searchStaticTiHistory from 'searchStaticTiHistory.js';

class App extends Component {
  state = {
    loggedIn: '',
    startTime: '',
    candidateName: '',
    candidateEmail: '',
    rooms: {
      tlkio: '',
      codestitch: '',
      zoom: ''
    },
    promptUrl: '',
    promptSelected: false,
  };

  componentDidMount() {
    gapi.load('client:auth2', async () => {
      const scopes = [
        'https://www.googleapis.com/auth/calendar', 
        'https://www.googleapis.com/auth/drive',
        'https://www.googleapis.com/auth/spreadsheets.readonly',
        ];
      await gapi.client.init({
        apiKey,
        // discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
        clientId: '695004460995-m8hbtlfkktf3d6opnafeer5j0dsbmn72.apps.googleusercontent.com',
        scope: scopes.join(' '),
      }).catch(err => alert(`Something went wrong with setting up Google OAuth: ${JSON.stringify(err)}. You should probably refresh.`));
      this.GoogleAuth = gapi.auth2.getAuthInstance();
      this.logout = this.GoogleAuth.disconnect.bind(this.GoogleAuth);
      this.GoogleAuth.isSignedIn.listen(this.handleLogin);
      this.GoogleAuth.isSignedIn.get() ? 
        this.handleLogin() :
        this.setState({ loggedIn: false });
    });
  }

  copyPrompt = async event => {
    this.setState({ promptSelected: true });
    const promptName = event.target.id;
    const promptId = {
      'Version Control': '1tTkmIotuBEP8PwvpxmTaTHKDDUCb8i0ikmTfm8D8oA4',
      'MRP': '196ClAKfTFgO8gWs3O57QGcddVnWiS9RNtAXpVuEcrxU',
      'Book Library': '1dDybGPnNcNr3kE9rJMB-_MmQAtFCTujCFauD0KrPNfY',
    }[promptName];
    try {
      const copyMetadata = await gapi.client.request({
        path: `https://www.googleapis.com/drive/v3/files/${promptId}/copy`,
        method: 'POST',
        body: {
          name: `${this.state.candidateName} - ${moment().format('YYYY-MM-DD')} - ${promptName}`,
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
    } catch (error) {
      console.error(error);
      this.setState({ promptButtonsShown: true })
      error.status === 401 ? 
        alert(`You have to be logged in.`) :
        alert(`
        Couldn't create the prompt document successfully.
        You can still use this app:
        just copy the prompt manually (see TI workflow), 
        share it so that anyone with the link can edit, 
        and paste the link into the prompt section below.`);
    }
  };

  getCalendarData = async () => {
    try {
      const {result: { items: calendars } } = await gapi.client.request({
        path: 'https://www.googleapis.com/calendar/v3/users/me/calendarList',
      });

      let hirCalendarId;
      try {
        hirCalendarId = calendars.filter(
          ({ summary }) => summary.includes('HiR'))[0].id;
      } catch (err) {
        console.error(err);
        alert(`You don't seem to be using your Hack Reactor account! Just log in again with the right account.`);
        this.GoogleAuth.disconnect();
        return;
      }

      const {result: {items: [interview] } } = await gapi.client.request({
        path: `https://www.googleapis.com/calendar/v3/calendars/${hirCalendarId}/events`,
        params: {
          singleEvents: true,
          orderBy: 'startTime',
          q: '#Interview Online with',
          timeMin: moment().subtract(10, 'minutes').toISOString(),
        },
      });
      const { description, start: { dateTime } } = interview;
      const soonestInterviewDetails = description.split('\n').slice(0, 3);
      const [candidateName, candidateEmail, tlkioLink] = soonestInterviewDetails.map(el => el.split(': ')[1]);
      const startTime = moment(dateTime);
      this.setState({
        startTime,
        candidateName,
        candidateEmail,
        rooms: { ...this.state.rooms, tlkio: tlkioLink },
      });
      this.getPrevInterviews(candidateEmail);
    } catch (err) {
      console.error(err);
      alert(`There was a problem retrieving information from your calendar; you might have to do it manually. Check the console for more info.`);
    }
  };

  getPrevInterviews = async email => {
    const path = 'https://sheets.googleapis.com/v4/spreadsheets/' +
      '1ObVQGqm894fzjeM5vcG2qysYKDng4g8rtgyIwS3vJh8' +
      '?ranges=%27Form%20Responses%27&includeGridData=true';
    const { result: { sheets: [sheet] } } = await gapi.client.request({ path });
    const { data: [{ rowData : rows }]} = sheet;
    // The sheet has a number of empty rows at the bottom,
    // which .filter would needlessly iterate through.
    const matchingRows = [];
    for (let i = 0; i < rows.length; i++) {
      const { values } = rows[i];
      // Empty cells are empty objects, so we can't just check truthiness.
      if (!Object.keys(values[0]).length) { // If we're past the filled rows
        break;
      }

      const rowEmail = values[4].effectiveValue.stringValue;
      if (rowEmail.trim() === email.trim()) { // No misleading whitespace
        matchingRows.push(values);
      }
    }
    console.log(matchingRows);
  };

  handleLogin = (loggingIn = true) => {
    if (!loggingIn) {
      this.setState({
        loggedIn: false,
        startTime: '',
        candidateName: '',
        candidateEmail: '',
        rooms: {
          tlkio: '',
          codestitch: '',
          zoom: ''
        },
        promptUrl: '',
        promptSelected: false,
      });
    } else {
      const loggedIn = this.GoogleAuth.currentUser.get().getBasicProfile().getName().split(' ')[0];
      this.setState({ loggedIn });
      this.getCalendarData();
    }
  };

  login = () => {
    // As of this writing (7.22.18), signIn has to be trigged from a click handler to work properly.
    this.GoogleAuth.signIn()
      .catch(err => {
        console.error(err);
        const { error } = err; 
        error === 'popup_closed_by_user' || error === 'access_denied' ?
            alert(`You don't have to log in, but it makes things much easier. Try again if you want.`) :
            alert(`There was a problem with login: ${error}. Try again, or refresh.`);
      });
  };

  setRoom = (value, name) => {
    this.setState({
      rooms: { ...this.state.rooms, [name]: value },
    });
  };

  render() {
    const { 
      loggedIn,
      startTime,
      candidateName,
      candidateEmail,
      rooms,
      promptUrl,
      promptSelected,
    } =  this.state;
    const {
      copyPrompt,
      login,
      logout,
      setRoom,
    } = this;
    return (
      <div className="app">
        <h1> HR Interview Noter </h1>

        <Setup
          {...{ login, loggedIn, logout, startTime, candidateName, candidateEmail, rooms, setRoom }}
        />
        <br />
        <Prompt
          {...{ loggedIn, copyPrompt, promptUrl, promptSelected }}
        />
        <br />
        <Notes />
      </div>
    );
  }
};

export default App;
