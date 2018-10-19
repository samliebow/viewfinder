import React, { Component } from 'react';

class Credits extends Component {
  state = {
    show: false,
  };

  toggleShow = () => {
    this.setState({ show: !this.state.show });
  };

  render() {
    return (<div>
      <h4 onClick={this.toggleShow}> Credits </h4>

      { this.state.show ?
        <div>
          <p>
            Viewfinder is the result of the combined efforts of several generations of HiRs.
            If you're reading this, we want you to add to those efforts,
            help improve it for future generations, and get an awesome resume item!
          </p>
          <p>
            The foundational work was done by{' '}
            <a href="https://github.com/kguinto">Kirk Guinto [HRSF89]</a>{' '}
            under the name Interview Noter.
            Kirk was the one who created a full-fledged app
            which brought together all the setup steps, the prompt,
            and time-stamped note-taking all in one window.
          </p>
          <p> 
            <a href="https://github.com/samliebow">Sam Liebow [HRSF93]</a>{' '}
            created the modern incarnation of Viewfinder
            by adding a bunch of config files and API integrations.
            Any bugs and design issues are probably his fault.
          </p>
          <p>
            The Notes component is based on Autohorse by{' '}
            <a href="https://github.com/emp-norton">James Jelenko [HRSF87]</a>,
            the first notetaking tool to automatically tally up horsepower and autonomy.
            Codestitch pad auto-generation is derived from{' '}
            <a href="https://github.com/kjng/codestitch-creator">Codestitch Creator</a> by{' '}
            <a href="https://github.com/kjng">Kevin Jang [HRR]</a>.
          </p>
          <p>
            <a href="https://github.com/lighthurst">Aaron Tesfai [HRSF95]</a>{' '}
            is the current maintainer of Viewfinder and wielder of the mighty hammer of bug-squashing.
          </p>
        </div> :
        <span>
          &nbsp;...
        </span>
      }
      <br />
    </div>)
  }
}

export default Credits;
