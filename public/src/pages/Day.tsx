import * as React from "react";
import { ReactMdeTypes } from "react-mde";
import { RouteComponentProps } from "react-router-dom";

import Editor, { Person } from "../components/Editor";
import { CreatePost, IsErrResp, IsPostResp } from "../services/HttpService";

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
  error: string;
  submitted: boolean;
}

class Day extends React.Component<RouteComponentProps<Params>, DayState> {
  constructor(props: RouteComponentProps<Params>, state: {}) {
    super(props, state);
    this.state = {
      editorContent: {
        text: "So how was your day?"
      },
      error: "",
      isSubmitting: false,
      submitted: false
    };

    this.contentCallback = this.contentCallback.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  public contentCallback(value: ReactMdeTypes.Value) {
    this.setState({ editorContent: value });
  }

  public handleClick(e: React.SyntheticEvent<HTMLAnchorElement>) {
    e.stopPropagation();
    this.setState({ isSubmitting: true });

    CreatePost(
      this.state.editorContent.text,
      this.props.match.params.user
    ).then(data => {
      if (IsErrResp(data)) {
        this.setState({ error: data.error, isSubmitting: false });
        return;
      }
      if (IsPostResp(data)) {
        this.setState({
          editorContent: { text: data.body },
          isSubmitting: false,
          submitted: true
        });
        return;
      }
    });
  }

  public render() {
    const loggedInUser = this.props.match.params.user;
    const Bhargav: Person = "Bhargav";
    const Ashima: Person = "Ashima";

    const editors = [Bhargav, Ashima].map(person => {
      const submitClasses = `day-submit button is-primary ${
        this.state.isSubmitting ? "is-loading" : ""
      }`;

      let isPreview = loggedInUser.toLowerCase() === person.toLowerCase();

      // If the post has been submitted, then switch to preview mode even for the
      // logged in user
      if (
        this.state.submitted &&
        loggedInUser.toLowerCase() === person.toLowerCase()
      ) {
        isPreview = !isPreview;
      }

      return (
        <div className="day-editor column" key={person}>
          <Editor
            content={this.state.editorContent}
            person={person}
            previewMode={isPreview}
            callback={this.contentCallback}
          />
          {isPreview ? (
            <a className={submitClasses} onClick={this.handleClick}>
              Submit
            </a>
          ) : null}
        </div>
      );
    });

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
