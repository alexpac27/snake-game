import React from 'react';
import './App.css';
import GameBoard from './Container/GameBoard'
import Login from './Container/Login'
import NavBar from './Container/NavBar'

function App() {
  return (
    <div className="App">
      <h1>App Container</h1>
        <NavBar/>
        <Login/>
        <GameBoard/>
    </div>
  );
}

export default App;
