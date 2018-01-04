import * as React from "react";
import "./App.css";

import { Route } from "react-router-dom";

import Day from './pages/Day';

class App extends React.Component {
  constructor(props: {}, state: {}) {
    super(props, state);
  }

  public render() {
    return (
      <div className="paper">
        <div className="App conatiner">
          <Route 
            path="/day" 
            component={Day} />
        </div>
      </div>
    );
  }
}

export default App;
