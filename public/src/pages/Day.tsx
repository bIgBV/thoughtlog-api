import * as React from "react";
import { RouteComponentProps, Link } from "react-router-dom";

import { Person } from "../components/Editor";
import EditorContainer from "../components/EditorContainer";
import { CreatePost, IsErrResp, IsPostResp } from "../services/HttpService";

import "./Day.css";

import { Value } from "react-mde/lib/definitions/types";

const Bhargav: Person = "Bhargav";
const Ashima: Person = "Ashima";

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
  isSubmitting: boolean;
  error: string;
  submitted: boolean;
}

class Day extends React.Component<RouteComponentProps<Params>, DayState> {
  constructor(props: RouteComponentProps<Params>, state: {}) {
    super(props, state);
    this.state = {
      error: "",
      isSubmitting: false,
      submitted: false
    };

    this.handleClick = this.handleClick.bind(this);
  }

  public handleClick(e: Value) {
    CreatePost(
      e.text,
      this.props.match.params.user,
      this.props.match.params.date
    ).then(data => {
      if (IsErrResp(data)) {
        this.setState({ error: data.error, isSubmitting: false });
        return;
      }
      if (IsPostResp(data)) {
        this.setState({
          isSubmitting: false,
          submitted: true
        });
        return;
      }
    });
  }

  public render() {
    const loggedInUser = this.props.match.params.user;

    return (
      <div className="day section">
        <div className="day-header title">{this.getDateString()}</div>
        <div className="columns">
          <div className="column is-1">
            <Link to={`/day/${loggedInUser}/${this.genPrev()}`}>
              <div className="link">
                <span className="icon">
                  <i className="fas fa-chevron-left" />
                </span>
              </div>
            </Link>
          </div>
          {[Bhargav, Ashima].map(person => (
            <EditorContainer
              key={person}
              content={{ text: "" }}
              loggedInPerson={loggedInUser}
              person={person}
              timestamp={this.props.match.params.date}
              onSubmit={this.handleClick}
            />
          ))}
          <div className="column is-1">
            <Link to={`/day/${loggedInUser}/${this.genNext()}`}>
              <div className="link">
                <span className="icon">
                  <i className="fas fa-chevron-right" />
                </span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  private getDateString() {
    const today = new Date(parseInt(this.props.match.params.date, 10));
    return `${DAY_MAP[today.getDay()]}, ${today.getDate()} ${
      MONTH_MAP[today.getMonth()]
    }, ${today.getFullYear()}`;
  }

  private genPrev() {
    const date = new Date(parseInt(this.props.match.params.date, 10));
    date.setDate(date.getDate() - 1);
    return date.getTime();
  }

  private genNext() {
    const date = new Date(parseInt(this.props.match.params.date, 10));
    date.setDate(date.getDate() + 1);
    return date.getTime();
  }
}

export default Day;
