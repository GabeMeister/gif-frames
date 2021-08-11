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
import RenderPage from './components/pages/RenderPage';
import TestPage from './components/pages/TestPage';
import HomePage from './components/pages/HomePage';
import styled from 'styled-components';

const StyledApp = styled.div`
  height: 100vh;
  width: 100%;
`;

window.$ = $;

function App() {
  return (
    <StyledApp>
      <Router>
        <div>
          <Switch>
            <Route path='/editor'>
              <EditorPage />
            </Route>
            <Route path='/render'>
              <RenderPage />
            </Route>
            <Route path='/test'>
              <TestPage />
            </Route>
            <Route path="/">
              <HomePage />
            </Route>
          </Switch>
        </div>
      </Router>
    </StyledApp>
  )
}

export default App;
