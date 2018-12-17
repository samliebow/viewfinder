import React, { Component } from 'react';
import Clipboard from 'clipboard';
import snippetsData from '../../snippetsData';

class Snippets extends Component {
  state = {
    initialShow: false,
    show: false,
    snippetIndex: 0,
  };

  componentDidUpdate() {
    if ((this.props.promptSelected || this.state.show) && !this.state.initialShow) {
      // Expands on either prompt selection or title click,
      // but obeys toggleShow afterwards
      this.setState({ initialShow: true, show: true })
    }
  }
 
  componentDidMount() {
    new Clipboard('.copy')
  }

  increment = () => this.setState({ 
    snippetIndex: Math.min(
      snippetsData[this.props.promptSelected].length - 1,
      this.state.snippetIndex + 1
    )
  })
  
  decrement = () => this.setState({ 
    snippetIndex: Math.max(this.state.snippetIndex - 1, 0)
  })

  toggleShow = () => {
    this.setState({ show: !this.state.show });
  };

  render() {
    const {
      initialShow,
      show,
      snippetIndex,
    } = this.state;
    const promptSnippets = snippetsData[this.props.promptSelected];
    const snippet = promptSnippets ? promptSnippets[snippetIndex] : '';
    return (
      <div>
        <h4 onClick={this.toggleShow}> Prompt snippets </h4>
        {initialShow && show ?
          <div>
            <textarea
              id="snippetField"
              value={snippet}
              readOnly
            />
            <button
              onClick={this.decrement}
            >
              Go back
            </button>
            <button
              className="copy"
              data-clipboard-target="#snippetField"
            >
              Copy
            </button>
            <button
              className="copy"
              onClick={this.increment}
              data-clipboard-target="#snippetField"
            >
              Copy and go forward
            </button>
          </div> :
          <span>
            &nbsp;...
          </span>
        }
      </div>
    )
  }
}

export default Snippets;