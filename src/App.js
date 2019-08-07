import React, { Component } from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import HomePage from './components/HomePageComponent';
import GamePage from './components/GamePageComponent';

const Error = () => {
  return (
    <div>
      <h1 className="text-white mt-5 titleTextSize specialFont">Error</h1>
      <br></br>
      <Link className="text-white mt-5 waitingTextSize" to="/">Back To Home Page</Link>
    </div>
  )
}

class App extends Component {
  render() {
    return (
      <Router>
          <Switch>
          <Route path={["/","/home"]} exact strict component={HomePage} />
          <Route path="/game" exact strict component={GamePage} />
          <Route component={Error} />
          </Switch>
      </Router>
    );
  }
}

export default App;
