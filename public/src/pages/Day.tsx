import * as React from "react";
import Editor, { Person } from "../components/Editor";

import { ReactMdeTypes } from "react-mde";
import { RouteComponentProps } from "react-router-dom";

import "./Day.css";

const DAY_MAP = {
  0: "Sunday",
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday"
};

const MONTH_MAP = {
  0: "January",
  1: "February",
  2: "March",
  3: "April",
  4: "May",
  5: "June",
  6: "July",
  7: "August",
  8: "September",
  9: "October",
  10: "November",
  11: "December"
};

interface Params {
  user: string;
  date: string;
}

interface DayState {
  editorContent: ReactMdeTypes.Value;
  isSubmitting: boolean;
}

class Day extends React.Component<RouteComponentProps<Params>, DayState> {
  constructor(props: RouteComponentProps<Params>, state: {}) {
    super(props, state);
    this.state = {
      editorContent: {
        text: "So how was your day?"
      },
      isSubmitting: false
    };

    this.contentCallback = this.contentCallback.bind(this);
  }

  public contentCallback(value: ReactMdeTypes.Value) {
    this.setState({ editorContent: value });
  }

  public render() {
    const loggedInUser = this.props.match.params.user;
    const Bhargav: Person = "Bhargav";
    const Ashima: Person = "Ashima";

    const editors = [Bhargav, Ashima].map(person => (
      <div className="day-editor column">
        <Editor
          content={this.state.editorContent}
          person={person}
          loggedInUser={loggedInUser}
          callback={this.contentCallback}
        />
        {loggedInUser.toLowerCase() === person.toLowerCase() ? (
          <a className="day-submit button is-primary">Submit</a>
        ) : null}
      </div>
    ));

    return (
      <div className="day section">
        <div className="day-header title">{this.getDateString()}</div>
        <div className="columns">{editors}</div>
      </div>
    );
  }

  private getDateString() {
    const today = new Date();
    return `${DAY_MAP[today.getDay()]}, ${today.getDate()} ${
      MONTH_MAP[today.getMonth()]
    }, ${today.getFullYear()}`;
  }
}

export default Day;
