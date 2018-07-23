import React, { Component } from 'react';
import moment from 'moment';
import ReactMarkdown from 'react-markdown';
import SectionTitle from './SectionTitle';
import TlkioScript from './TlkioScript';
import LinkRenderer from './LinkRenderer';
import Steps from './Steps';
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
      rooms: {
        tlkio,
        codestitch,
        zoom,
      },
    } = this.props;
    const currentDate = moment().format('YYYY-MM-DD');

    return (
      <div className="setup">
        <SectionTitle
          title="Setup"
          sectionName="setup"
          toggleShow={this.toggleShow}
        />
        {this.state.show ? 
          <div>
            {startTime ? 
              <div> Hi {loggedIn}! Your interview with {candidateName} starts at {startTime.format('LT')}. 
                <br />(Not {loggedIn}? <a href='#' onClick={logout}>Click here.</a>)
              </div> :
              <div> {loggedIn ? 
                'Fetching data...' :
                loggedIn === false ?
                  <span> <a href='#' onClick={login}>Click here</a> to log in. </span>:
                  `Checking if you're logged in...`} 
              </div> }
            <Steps 
              {...{ candidateName, candidateEmail, currentDate, tlkio }}
            />
            <Input name="tlkio" setter={this.setRoom} value={tlkio}/>
            <Input name="codestitch" setter={this.setRoom} />
            <Input name="zoom" setter={this.setRoom} />
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
