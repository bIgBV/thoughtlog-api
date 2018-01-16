import * as React from "react";
import "./App.css";

import { Redirect, Route, Switch } from "react-router-dom";

import Day from "./pages/Day";
import Login from "./pages/Login";

interface AppProps {
  isLoggedIn: boolean;
  loginData?: object;
}

interface AppState {
  isLoggedIn: boolean;
}

class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps, state: AppState) {
    super(props, state);

    this.state = {
      isLoggedIn: false
    };

    this.setLoggedIn = this.setLoggedIn.bind(this);
  }

  public setLoggedIn(value: boolean) {
    this.setState({ isLoggedIn: value });
  }

  public render() {
    interface PrivateDayProps {
      component: typeof Day;
      path: string;
    }
    const PrivateDay: React.StatelessComponent<PrivateDayProps> = ({
      component: Component,
      ...rest
    }) => (
      <Route
        {...rest}
        render={props =>
          this.state.isLoggedIn ? (
            <Component {...props} />
          ) : (
            <Redirect
              to={{
                pathname: "/login",
                state: { from: props.location }
              }}
            />
          )
        }
      />
    );
    return (
      <div className="paper">
        <div className="App">
          <Switch>
            <Route
              path="/login"
              render={props => (
                <Login
                  {...props}
                  callback={this.setLoggedIn}
                  isLoggedIn={this.state.isLoggedIn}
                />
              )}
            />
            <PrivateDay path="/day/:user/:date" component={Day} />
            <Redirect to="/login" />
          </Switch>
        </div>
      </div>
    );
  }
}

export default App;
