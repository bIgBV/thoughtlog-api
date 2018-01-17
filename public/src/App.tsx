import * as React from 'react';
import './App.css';

import { Redirect, Route, Switch } from 'react-router-dom';

import Day from './pages/Day';
import Login from './pages/Login';

interface PrivateDayProps {
  component: typeof Day;
  isLoggedIn: boolean;
  token: string;
  path: string;
}
const PrivateDay: React.StatelessComponent<PrivateDayProps> = ({
  component: Component,
  isLoggedIn: isLoggedIn,
  token: token,
  ...rest
}) => (
  <Route
    {...rest}
    render={props =>
      isLoggedIn ? (
        <Component {...props} token={token} />
      ) : (
        <Redirect
          to={{
            pathname: '/login',
            state: {from: props.location},
          }}
        />
      )
    }
  />
);

interface AppProps {
  isLoggedIn: boolean;
  loginData: {token: string};
}

interface AppState {
  isLoggedIn: boolean;
  token: string;
}

class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps, state: AppState) {
    super(props, state);

    this.state = {
      isLoggedIn: this.props.isLoggedIn,
      token: this.props.loginData.token,
    };

    this.setLoggedIn = this.setLoggedIn.bind(this);
  }

  public setLoggedIn(value: boolean, token: string) {
    if (token !== '') {
      this.setState({isLoggedIn: value, token});
    }
  }

  public render() {
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
            <PrivateDay
              path="/day/:user/:date"
              component={Day}
              token={this.state.token}
              isLoggedIn={this.state.isLoggedIn}
            />
            <Redirect to="/login" />
          </Switch>
        </div>
      </div>
    );
  }
}

export default App;
