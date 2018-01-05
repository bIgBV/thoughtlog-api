import * as React from "react";
import "./App.css";

import { Redirect, Route } from "react-router-dom";

import Day from "./pages/Day";
import Login from "./pages/Login";

interface AppProps {
  isLoggedIn: boolean;
  loginData?: object;
}

class App extends React.Component<AppProps, {}> {
  constructor(props: AppProps, state: {}) {
    super(props, state);
  }

  public render() {
    return (
      <div className="paper">
        <div className="App conatiner">
          <Route
            path="/"
            render={() =>
              this.props.isLoggedIn ? (
                <Redirect to="/day" />
              ) : (
                <Redirect to="/login" />
              )
            }
          />
          <Route path="/day" component={Day} />
          <Route path="/login" component={Login} />
        </div>
      </div>
    );
  }
}

export default App;
