import React from 'react';
import $ from 'jquery';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';

import './App.css';
import EditorPage from './components/pages/EditorPage';
import HomePage from './components/pages/HomePage';

window.$ = $;

function App() {
  const query = new URLSearchParams(window.location.search);
  console.log('query gifUrl', query.get('gifUrl'));

  return (
    <div className="font-sans">
      <Router>
        <div>
          <Switch>
            <Route path='/home'>
              <HomePage />
            </Route>
            <Route path='/editor'>
              <EditorPage />
            </Route>
            <Route path="/">
              <HomePage />
            </Route>
          </Switch>
        </div>
      </Router>
    </div>
  )
}

export default App;
