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
    const {
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

    const steps = `
1. Search for ${candidateEmail || 'the candidate\'s email'} in the [Technical Interview Decisions spreadsheet](https://docs.google.com/spreadsheets/d/1ObVQGqm894fzjeM5vcG2qysYKDng4g8rtgyIwS3vJh8/edit#gid=391982378) (both 'Form Responses' and 'TI History'). 
2. Choose the first prompt they haven't gotten (in order: Version Control, MRP, Book Library). Click that button below.
3. Open up a [Codestitch](https://codestitch.io) window, and paste the URL into the input field below.
4. Schedule a Zoom call named \`${candidateName || 'FIRSTNAME LASTNAME'} - ${currentDate}\` and paste the join link into the input field below.
    * Make sure it's set to record automatically to the cloud.
5. Go to [the tlk.io link](${tlkio}) and conduct the interview, using the script snippets below.
6. Move the completed prompt document from [My Drive](https://drive.google.com/drive/my-drive) to the appropriate month's folder [here](https://drive.google.com/drive/folders/0B5_RJCdGH93GdW1fMWMzQlg3VEE).
7. Fill out the [Technical Interview Decisions Form](https://goo.gl/forms/IODn7sw3jtpiUq2n1).
8. If you have any questions, reference the [TI Workflow.](https://docs.google.com/document/d/18AJkthUSgu40QUYwQNdQ3B23SIFMVSU5HDr_5bVaCws/edit)
`;

    return (
      <div className="setup">
        <SectionTitle
          title="Setup"
          sectionName="setup"
          toggleShow={this.toggleShow}
        />
        <div style={{ display: this.state.show ? 'block' : 'none' }}>
          {startTime ? 
            <div> Hi {loggedIn}! Your interview with {candidateName} starts at {startTime.format('h:mm')}. 
            <br />(Not {loggedIn}? <a href='#' onClick={logout}>Click here.</a>)
            </div> :
            <div> {loggedIn ? 'Fetching data...' : `You're not logged in.`} </div> }
          <ReactMarkdown source={steps} renderers={{ link: LinkRenderer }} />
          <Input name="codestitch" setter={this.setRoom} />
          <Input name="tlkio" setter={this.setRoom} value={tlkio}/>
          <Input name="zoom" setter={this.setRoom} />
          <TlkioScript
            tlkio={tlkio}
            codestitch={codestitch}
            zoom={zoom}
            name={candidateName}
            email={candidateEmail}
            startTime={startTime}
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
