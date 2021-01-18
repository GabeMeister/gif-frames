import React from 'react';
import $ from 'jquery';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';

import './reset.css';
import './App.css';
import EditorPage from './components/pages/EditorPage';
import HomePage from './components/pages/HomePage';

window.$ = $;

function App() {
  return (
    <div className="h-screen">
      <Router>
        <div>
          <Switch>
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
