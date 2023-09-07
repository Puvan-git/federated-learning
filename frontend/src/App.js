import logo from './logo.svg';
import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact>
          <MainPage />
        </Route>
        <Route path="/training">
          <TrainingPage />
        </Route>
      </Switch>
    </Router>
  );
}

function MainPage() {
  return (
    <div>
      <button onClick={() => window.location.href = "/training"}>
        Start Training
      </button>
    </div>
  );
}

function TrainingPage() {
  return (
    <div>
      Training in progress...
    </div>
  );
}

export default App;