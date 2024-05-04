import React from 'react';
import './App.css';
import logo from './logo.svg';
import Select from './Select';

const App = ({ name }: { name: string }) => {
  return (
    <div className="App">
      <header className="App-header">
        <h1>{name}</h1>
        <img src={logo} className="App-logo" alt="logo" />
        <Select width={200} value={null} options={['option 1', 'option 2']} />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
