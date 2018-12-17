import React, { Component } from 'react';

class Prompt extends Component {
  state = {
    initialShow: false,
    show: false,
    source: ''
  };

  componentDidUpdate() {
    if ((this.props.promptSelected || this.state.show) && !this.state.initialShow) {
      // Expands on either prompt selection or title click,
      // but obeys toggleShow afterwards
      this.setState({ initialShow: true, show: true })
    }
  }

  setSource = source => {
    this.setState({ source });
  };

  toggleShow = () => {
    this.setState({ show: !this.state.show });
  };

  render() {
    const { 
      initialShow,
      show,
      source,
    } = this.state;
    const {
      loggedIn,
      copyPrompt,
      promptUrl,
      promptSelected,
    } = this.props;

    return (
      <div>
        <h4 onClick={this.toggleShow}> Prompt </h4>
        {initialShow && show ? 
          <div>
            <input
              placeholder={"Google Drive prompt link"}
              defaultValue={promptUrl}
              className="promptUrl"
              onKeyDown={event => {
                if (event.keyCode === 13) {
                  this.setSource(event.target.value);
                }
              }}
            />
          {loggedIn && !promptSelected ? 
            ['Version Control', 'MRP', 'Book Library'].map(prompt => (
            <button className="promptBtn" id={prompt} key={prompt} onClick={copyPrompt}>
              Use {prompt}
            </button>)) 
            : (promptSelected && !promptUrl ? 'Please wait, prompt loading...' : null)}
            <span>
              <iframe
                className="prompt"
                src={source || promptUrl}
              />
            </span>
          </div> :
          <span>
            &nbsp;...
          </span>
        }
      </div>
    );
  }
}

export default Prompt;
