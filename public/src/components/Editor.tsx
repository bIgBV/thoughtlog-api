import * as React from "react";
import ReactMde, { ReactMdeCommands, ReactMdeTypes } from "react-mde";

import "font-awesome/css/font-awesome.css";
import "react-mde/lib/styles/css/react-mde-all.css";
import "./Editor.css";

export type Person = string;

interface EditorState {
  content: ReactMdeTypes.Value;
}

interface EditorProps {
  text: string;
  person: Person;
  loggedInUser: string;
}

class Editor extends React.Component<EditorProps, EditorState> {
  constructor(props: EditorProps, state: EditorState) {
    super(props, state);

    this.state = {
      content: {
        text: ""
      }
    };
  }

  public componentDidMount() {
    this.setState({
      content: {
        text: this.props.text
      }
    });
  }

  public handleValueChange = (value: ReactMdeTypes.Value) => {
    this.setState({ content: value });
  };

  public render() {
    return (
      <div className="editor content">
        <div className="subtitle is-3">{this.props.person}</div>
        <ReactMde
          textAreaProps={{
            id: "ta1",
            name: "ta1"
          }}
          value={this.state.content}
          onChange={this.handleValueChange}
          commands={ReactMdeCommands.getDefaultCommands()}
          visibility={{
            previewHelp:
              this.props.person.toLowerCase() ===
              this.props.loggedInUser.toLowerCase(),
            textarea:
              this.props.person.toLowerCase() ===
              this.props.loggedInUser.toLowerCase(),
            toolbar:
              this.props.person.toLowerCase() ===
              this.props.loggedInUser.toLowerCase()
          }}
        />
      </div>
    );
  }
}

export default Editor;
