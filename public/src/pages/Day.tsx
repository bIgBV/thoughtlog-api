import * as React from "react";
import Editor from "../components/Editor";

import './Day.css';

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

class Day extends React.Component<{}, {}> {
  constructor(props: {}, state: {}) {
    super(props, state);
    this.state = {
      isSubmitting: false
    };
  }

  public render() {
    return (
      <div className="day section">
        <div className="day-header title">
          {this.getDateString()}
        </div>
        <div className="columns">
          <div className="day-editor column">
            <Editor
              text="Tell me about your day.." 
              personName="Bhargav"/>
            <a className="day-submit button is-primary">
              Submit
            </a>
          </div>
          <div className="day-editor column">
            <Editor 
              text="Tell me about your day.." 
              personName="Ashima"/>
            <a className="day-submit button is-primary">
              Submit
            </a>
          </div>
        </div>
      </div>
    );
  }

  private getDateString() {
    const today = new Date();
    return `${DAY_MAP[today.getDay()]}, ${today.getDate()} ${MONTH_MAP[today.getMonth()]}, ${today.getFullYear()}`;
  }
}

export default Day;
