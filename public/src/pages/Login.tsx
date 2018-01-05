import { History } from "history";
import * as React from "react";

import { AuthLogin } from "../services/HttpService";

import "./Login.css";

interface AppState {
  username: string;
  password: string;
  isSubmitting: boolean;
  error: string | null;
}

export default class Login extends React.Component<
  { history: History },
  AppState
> {
  constructor(props: { history: History }, state: AppState) {
    super(props, state);

    this.state = {
      error: "",
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
        if (data.status_code && data.status_code > 400) {
          this.setState({ error: data.error });
          return;
        }
        this.props.history.push(`/day?user=${data.name}`);
      })
      .catch((err: Error) => this.setState({ error: err.message }));
  }

  public render() {
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
                <div className="notification is-danger">
                  {this.state.error}
                </div>
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
