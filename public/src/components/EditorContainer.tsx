import * as React from "react";
import { Value } from "react-mde/lib/definitions/types";

import { GetPost, IsErrResp } from "../services/HttpService";
import Editor, { Person } from "./Editor";

interface EditorBlockProps {
  person: Person;
  timestamp: string;
  content: Value;
  loggedInPerson: Person;
  onSubmit: (e: Value) => void;
}

interface EditorBlockState {
  isPreview: boolean;
  isLoading: boolean;
  content: Value;
  error: string;
}

export default class EditorBlock extends React.Component<
  EditorBlockProps,
  EditorBlockState
> {
  constructor(props: EditorBlockProps, state: EditorBlockState) {
    super(props, state);

    this.state = {
      content: {
        text: ""
      },
      error: "",
      isLoading: false,
      isPreview: false
    };

    this.contentCallback = this.contentCallback.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  public componentDidMount() {
    this.setState({ isLoading: true });

    GetPost(this.props.timestamp).then(data => {
      if (IsErrResp(data)) {
        this.setState({
          error: data.error
        });
        return;
      }

      const fetchedContent = data.data;

      if (fetchedContent.length === 0) {
        this.setState({
          content: this.props.content,
          isLoading: false
        });
      } else {
        this.setState({
          content: {
            text: data.data.filter(post => post.created_by === 0)[0].body
          },
          isLoading: false
        });
      }
    });
  }

  public contentCallback(value: Value) {
    this.setState({ content: value });
  }

  public handleSubmit(e: React.SyntheticEvent<HTMLAnchorElement>) {
    e.preventDefault();

    this.props.onSubmit(this.state.content);
  }

  public render() {
    let isPreview = true;

    if (
      this.props.loggedInPerson.toLowerCase() ===
      this.props.person.toLowerCase()
    ) {
      isPreview = this.state.content.text !== "";
    }

    return (
      <div className="day-editor column" key={this.props.person}>
        <Editor
          content={this.state.content}
          person={this.props.person}
          previewMode={isPreview}
          callback={this.contentCallback}
        />
        {isPreview ? null : (
          <a className="button is-primary" onClick={this.handleSubmit}>
            Submit
          </a>
        )}
      </div>
    );
  }
}
