import React, { Component } from 'react';
import moment from 'moment';
import ReactMarkdown from 'react-markdown';
import TlkioScript from './TlkioScript';
import LinkRenderer from './LinkRenderer';
import Steps from './Steps';

const Input = ({ name, setter, value }) => (
  <input
    className="room"
    placeholder={name}
    value={value}
    onChange={event => {
      setter(event.target.value, name);
    }}
  />
);

class Setup extends Component {
  state = {
    show: true
  };

  toggleShow = () => {
    this.setState({ show: !this.state.show });
  };

  render() {
    const {
      login,
      loggedIn,
      logout,
      startTime,
      candidateName,
      candidateEmail,
      staticTiRows,
      liveTiRows,
      rooms: {
        tlkio,
        codestitch,
        zoom,
      },
      setRoom,
      suggestedPrompt,
      copyPrompt,
    } = this.props;
    const interviewTime = startTime ?
      (moment().isSame(startTime, 'day') ?
        startTime.format('LT [today]') :
        startTime.format('LT dddd [the] Do'))
      : null;
    const interviewDate = (startTime || moment()).format('YYYY-MM-DD');
    const loggedInFirstName = loggedIn.split(' ')[0];

    return (
      <div className="setup">
        <h4 onClick={this.toggleShow}> Setup </h4>
        {this.state.show ? 
          <div>
            {startTime ? 
              <div> Hi {loggedInFirstName}! Your interview with {candidateName} starts at {interviewTime}.
                <br />(Not {loggedIn}? <a href='#' onClick={logout}>Click here.</a>)
              </div> :
              <div> {loggedIn ? 
                'Fetching data...' :
                loggedIn === false ?
                  <span> <a href='#' onClick={login}>Click here</a> to log in. </span>:
                  `Checking if you're logged in...`} 
              </div> }
            <Steps 
              {...{
                candidateName,
                candidateEmail,
                interviewDate,
                tlkio,
                staticTiRows,
                liveTiRows,
                suggestedPrompt,
                copyPrompt,
              }}
            />
            <Input name="tlkio" setter={setRoom} value={tlkio}/>
            <Input name="codestitch" setter={setRoom} />
            <Input name="zoom" setter={setRoom} />
            <TlkioScript
              {...{ tlkio, codestitch, zoom, name: candidateName, email: candidateEmail, startTime }}
            />
          </div> :
          <span>
            &nbsp;...
          </span>
        }
      </div>
    );
  }
}

export default Setup;
