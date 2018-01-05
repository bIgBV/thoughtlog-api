import * as React from "react";
import { Redirect, RouteComponentProps } from "react-router-dom";

import { AuthLogin } from "../services/HttpService";

import "./Login.css";

interface LoginState {
  username: string;
  password: string;
  isSubmitting: boolean;
  error: string | null;
  isLoggedIn: boolean;
}

interface LoginProps extends RouteComponentProps<{}> {
  callback: (value: boolean) => void;
  isLoggedIn: boolean;
}

export default class Login extends React.Component<LoginProps, LoginState> {
  constructor(props: LoginProps, state: LoginState) {
    super(props, state);

    this.state = {
      error: "",
    isLoggedIn: this.props.isLoggedIn || false,
      isSubmitting: false,
      password: "",
      username: ""
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  public handleInputChange(e: React.SyntheticEvent<HTMLInputElement>) {
    const updatedState = {};
    updatedState[e.currentTarget.name] = e.currentTarget.value;
    this.setState(updatedState);
  }

  public handleClick(e: React.SyntheticEvent<HTMLButtonElement>) {
    this.setState({ isSubmitting: true });

    AuthLogin(this.state.username, this.state.password)
      .then(data => {
        /* tslint:disable */
        console.log(data);
        /* tslint:enable */
        if (data.status_code > 400) {
          this.setState({ error: data.error });
          return;
        }
        if (data.status_code === 202) {
          this.props.callback(true);
          this.setState({ isLoggedIn: true });
        }
      })
      .catch((err: Error) => this.setState({ error: err.message }));
  }

  public render() {
    if (this.state.isLoggedIn) {
      return (
        <Redirect to={`/day/${this.state.username}/${new Date().getTime()}`} />
      );
    }

    const btnClasses = `button is-primary ${
      this.state.isSubmitting ? "is-loading" : ""
    }`;

    return (
      <div className="section">
        <div className="level">
          <div className="level-item">
            <div className="login-form box">
              <div className="field">
                <div className="label">Name</div>
                <div className="control">
                  <input
                    type="text"
                    className="input"
                    name="username"
                    value={this.state.username}
                    placeholder="what's your name?"
                    onChange={this.handleInputChange}
                  />
                </div>
              </div>
              <div className="field">
                <div className="label">Password</div>
                <div className="control">
                  <input
                    type="password"
                    className="input"
                    name="password"
                    value={this.state.password}
                    onChange={this.handleInputChange}
                  />
                </div>
              </div>
              {this.state.error === "" ? null : (
                <div className="notification is-danger">{this.state.error}</div>
              )}
              <div className="control">
                <button className={btnClasses} onClick={this.handleClick}>
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
