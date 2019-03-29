import React, { Component } from 'react';
import moment from 'moment';
import axios from 'axios';
import Credits from './Credits';
import Notes from './Notes';
import Prompt from './Prompt';
import Setup from './Setup';
import Snippets from './Snippets';
import searchStaticTiHistory from './searchStaticTiHistory';
import searchLiveTiHistory from './searchLiveTiHistory';
import {
  apiKey,
  clientId,
  interviewsTitlePrefix,
  interviewMonthsFolderId,
  interviewMonthFolderName,
  prompts,
  suggestPrompt,
  codestitchEmail,
  codestitchPassword,
} from '../../config';

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
    promptSelected: '',
    suggestedPrompt: '',
    staticTiRows: null,
    liveTiRows: null,
    zoomToken: '',
  };

  static getInterviewDetails = (description) => {
    // Determine whether the interview is based on the newer format
    const isNewer = description.includes('YCBM link ref');

    if (isNewer) {
      const parsedResults = description.split('\n').map(el => el.split(': ')[1]);
      const candidateName = `${parsedResults[5]} ${parsedResults[6]}`;
      const candidateEmail = parsedResults[7];
      const tlkioLink = parsedResults[3];

      return [candidateName, candidateEmail, tlkioLink];
    } else {
      const soonestInterviewDetails = description.split('\n').slice(0, 3);
      return soonestInterviewDetails.map(el => el.split(': ')[1]);
    }
  };

  componentDidMount() {
    fetch(`codestitch?email=${codestitchEmail}&password=${codestitchPassword}`)
      .then(response => response.text())
      .then(url => this.setRoom(url, 'codestitch'));
    gapi.load('client:auth2', async () => {
      const scope = [
        'https://www.googleapis.com/auth/calendar',
        'https://www.googleapis.com/auth/drive',
        'https://www.googleapis.com/auth/spreadsheets.readonly',
        ].join(' ');
      await gapi.client.init({ apiKey, clientId, scope })
        .catch(err => alert(`Something went wrong with setting up Google OAuth: ${JSON.stringify(err)}. You should probably refresh.`));
      this.GoogleAuth = gapi.auth2.getAuthInstance();
      this.logout = this.GoogleAuth.disconnect.bind(this.GoogleAuth);
      this.GoogleAuth.isSignedIn.listen(this.handleLogin);
      this.GoogleAuth.isSignedIn.get() ?
        this.handleLogin() :
        this.setState({ loggedIn: false });
    });
    // If user just authorized Zoom, the access token will be a query param.
    const zoomToken = new URLSearchParams(document.location.search).get('access_token');
    if (zoomToken) {
      this.setState({ zoomToken });
      history.replaceState(null, null, 'http://lvh.me:3033'); //Remove access token from displayed URL
    } else {
      // Catch only because server responds with 303 (it's really a redirect)
      axios.get('zoom').catch(({ response: { data: url } }) => window.location.replace(url));
    }
  }

  copyPrompt = async event => {
    this.setState({ promptSelected: event.target.id, suggestedPrompt: '' });
    const promptName = event.target.id;
    const promptId = prompts[promptName];
    const { candidateName, startTime } = this.state;
    try {
      const { result: { files: [{ id: monthFolder }] } } = await gapi.client.request({
        path: 'https://www.googleapis.com/drive/v3/files',
        params: {
          q: `'${interviewMonthsFolderId}' in parents and name contains '${interviewMonthFolderName}'`,
        },
      });
      const copyMetadata = await gapi.client.request({
        path: `https://www.googleapis.com/drive/v3/files/${promptId}/copy`,
        method: 'POST',
        body: {
          name: `${candidateName} - ${startTime.format('YYYY-MM-DD')} - ${promptName}`,
          parents: [monthFolder],
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
      const { result: { items: calendars } } = await gapi.client.request({
        path: 'https://www.googleapis.com/calendar/v3/users/me/calendarList',
      });
      const loggedInLC = this.state.loggedIn.replace(/\s/g, '.').toLowerCase();
      let hirCalendarId;
      try {
        const hirCalendarsSubscribed = calendars.filter(
          ({ summary }) => summary.includes('HiR'));
        const hirCalendarLoggedIn = hirCalendarsSubscribed.filter(
          ({ summary }) => summary.includes(loggedInLC))[0] || hirCalendarsSubscribed[0];
        hirCalendarId = hirCalendarLoggedIn.id;
      } catch (err) {
        console.error(err);
        alert(`You don't seem to be using your Hack Reactor account! Just log in again with the right account.`);
        this.GoogleAuth.disconnect();
        return;
      }

      const { result: {items: [interview] } } = await gapi.client.request({
        path: `https://www.googleapis.com/calendar/v3/calendars/${hirCalendarId}/events`,
        params: {
          singleEvents: true,
          orderBy: 'startTime',
          q: interviewsTitlePrefix,
          timeMin: moment().toISOString(), // Interview will be the first that hasn't yet ended
        },
      });
      const { description, start: { dateTime } } = interview;
      const [candidateName, candidateEmail, tlkioLink] = App.getInterviewDetails(description);

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
    const staticTiRows = searchStaticTiHistory(email);
    try {
      const liveTiRows = await searchLiveTiHistory(email);
      const allRecords = (liveTiRows.join('') + staticTiRows.join('')).toLowerCase();
      const suggestedPrompt = suggestPrompt(allRecords);
      this.setState({ staticTiRows, liveTiRows, suggestedPrompt });
    } catch (err) {
      console.error(err);
      this.setState({ staticTiRows });
    }
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
        promptSelected: '',
        suggestedPrompt: '',
        staticTiRows: null,
        liveTiRows: null,
      });
    } else {
      const loggedIn = this.GoogleAuth.currentUser.get().getBasicProfile().getName();
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
      suggestedPrompt,
      staticTiRows,
      liveTiRows,
      zoomToken,
    } =  this.state;
    const {
      copyPrompt,
      login,
      logout,
      setRoom,
    } = this;
    return (
      <div className="app">
        <h1> Viewfinder </h1>

        <Setup
          {...{
            login,
            loggedIn,
            logout,
            startTime,
            candidateName,
            candidateEmail,
            staticTiRows,
            liveTiRows,
            rooms,
            setRoom,
            suggestedPrompt,
            copyPrompt,
            zoomToken,
          }}
        />
        <br />
        <Prompt
          {...{ loggedIn, copyPrompt, promptUrl, promptSelected }}
        />
        <Snippets 
          {...{ promptSelected }}
        />
        <br />
        <Notes />
        <Credits />
      </div>
    );
  }
};

export default App;
