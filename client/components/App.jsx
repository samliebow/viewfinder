import React, { Component } from 'react';
import Notes from './Notes';
import Prompt from './Prompt';
import Setup from './Setup';

const App = () => (
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

    <Setup />

    <Prompt />

    <Notes />
  </div>
);

export default App;
