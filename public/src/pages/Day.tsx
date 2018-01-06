import * as React from "react";
import { RouteComponentProps } from "react-router-dom";

import Editor, { Person } from "../components/Editor";
import {
  CreatePost,
  GetPost,
  IsErrResp,
  IsPostResp,
  Post
} from "../services/HttpService";

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
  editorContent: Value;
  isSubmitting: boolean;
  error: string;
  submitted: boolean;
  fetchedContent: Post[];
}

class Day extends React.Component<RouteComponentProps<Params>, DayState> {
  constructor(props: RouteComponentProps<Params>, state: {}) {
    super(props, state);
    this.state = {
      editorContent: {
        text: "So how was your day?"
      },
      error: "",
      fetchedContent: [],
      isSubmitting: false,
      submitted: false
    };

    this.contentCallback = this.contentCallback.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  public componentDidMount() {
    GetPost(this.props.match.params.date).then(data => {
      if (IsErrResp(data)) {
        this.setState({
          error: data.error
        });
        return;
      }
      if (data.data.length > 0 && IsPostResp(data[0])) {
        this.setState({
          fetchedContent: data.data
        });
      }
    });
  }

  public contentCallback(value: Value) {
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
          isSubmitting: false,
          submitted: true
        });
        return;
      }
    });
  }

  public render() {
    const loggedInUser = this.props.match.params.user;
    const fetchedContent = this.state.fetchedContent;

    /* tslint:disable */
    switch (mode(loggedInUser, fetchedContent)) {
      case EditorMode.BE:
        return (
          <div className="day section">
            <div className="day-header title">{this.getDateString()}</div>
            <div className="columns">
              <BEditAEdit
                onClick={this.contentCallback}
                onSubmit={this.handleClick}
              />
            </div>
          </div>
        );
      case EditorMode.BeAp:
        return (
          <div className="day section">
            <div className="day-header title">{this.getDateString()}</div>
            <div className="columns">
              <BEditAPreview
                fetchedContent={fetchedContent[0].body}
                onClick={this.contentCallback}
                onSubmit={this.handleClick}
              />
            </div>
          </div>
        );
      case EditorMode.BpAe:
        return (
          <div className="day section">
            <div className="day-header title">{this.getDateString()}</div>
            <div className="columns">
              <BPreviewAEdit
                fetchedContent={fetchedContent[0].body}
                onClick={this.contentCallback}
                onSubmit={this.handleClick}
              />
            </div>
          </div>
        );
      case EditorMode.BP:
        return (
          <div className="day section">
            <div className="day-header title">{this.getDateString()}</div>
            <div className="columns">
              <BPreviewAPreview
                onClick={this.contentCallback}
                onSubmit={this.handleClick}
              />
            </div>
          </div>
        );
    }
    /* tslint:enable */
  }

  private getDateString() {
    const today = new Date();
    return `${DAY_MAP[today.getDay()]}, ${today.getDate()} ${
      MONTH_MAP[today.getMonth()]
    }, ${today.getFullYear()}`;
  }
}

export default Day;

interface EditorBlockProps {
  person: Person;
  content: Value;
  previewMode: boolean;
  onClick: (e: Value) => void;
  onSubmit: (e: React.SyntheticEvent<HTMLAnchorElement>) => void;
}

const EditorBlock: React.StatelessComponent<EditorBlockProps> = props => (
  <div className="day-editor column" key={props.person}>
    <Editor
      content={props.content}
      person={props.person}
      previewMode={props.previewMode}
      callback={props.onClick}
    />
    {!props.previewMode ? (
      <a className="button is-primary" onClick={props.onSubmit}>
        Submit
      </a>
    ) : null}
  </div>
);

interface BaseProps {
  onClick: (e: Value) => void;
  onSubmit: (e: React.SyntheticEvent<HTMLAnchorElement>) => void;
}

const BEditAEdit: React.StatelessComponent<BaseProps> = props => (
  <React.Fragment>
    <EditorBlock
      content={{ text: "How was your day?" }}
      person={Bhargav}
      previewMode={false}
      onClick={props.onClick}
      onSubmit={props.onSubmit}
    />
    <EditorBlock
      content={{ text: "How was your day?" }}
      person={Ashima}
      previewMode={false}
      onClick={props.onClick}
      onSubmit={props.onSubmit}
    />
  </React.Fragment>
);

const BPreviewAPreview: React.StatelessComponent<BaseProps> = props => (
  <React.Fragment>
    <EditorBlock
      content={{ text: "" }}
      person={Bhargav}
      previewMode={true}
      onClick={props.onClick}
      onSubmit={props.onSubmit}
    />
    <EditorBlock
      content={{ text: "" }}
      person={Ashima}
      previewMode={true}
      onClick={props.onClick}
      onSubmit={props.onSubmit}
    />
  </React.Fragment>
);

interface SinglePreviewProps extends BaseProps {
  fetchedContent: string;
}

const BEditAPreview: React.StatelessComponent<SinglePreviewProps> = props => (
  <React.Fragment>
    <EditorBlock
      content={{ text: "How was your day" }}
      person={Bhargav}
      previewMode={false}
      onClick={props.onClick}
      onSubmit={props.onSubmit}
    />
    <EditorBlock
      content={{ text: props.fetchedContent }}
      person={Ashima}
      previewMode={true}
      onClick={props.onClick}
      onSubmit={props.onSubmit}
    />
  </React.Fragment>
);

const BPreviewAEdit: React.StatelessComponent<SinglePreviewProps> = props => (
  <React.Fragment>
    <EditorBlock
      content={{ text: props.fetchedContent }}
      person={Bhargav}
      previewMode={true}
      onClick={props.onClick}
      onSubmit={props.onSubmit}
    />
    <EditorBlock
      content={{ text: props.fetchedContent }}
      person={Ashima}
      previewMode={true}
      onClick={props.onClick}
      onSubmit={props.onSubmit}
    />
  </React.Fragment>
);

enum EditorMode {
  BP,
  BeAp,
  BpAe,
  BE
}

function mode(loggedInUser: string, fetchedContent: Post[]): EditorMode {
  if (fetchedContent.length === 0) {
    return EditorMode.BE;
  }
  if (fetchedContent.length === 2) {
    return EditorMode.BP;
  }
  return fetchedContent[0].created_by === 0 ? EditorMode.BpAe : EditorMode.BeAp;
}
