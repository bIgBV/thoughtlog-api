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
  content: ReactMdeTypes.Value;
  person: Person;
  previewMode: boolean;
  callback: (value: ReactMdeTypes.Value) => void;
}

class Editor extends React.Component<EditorProps, EditorState> {
  constructor(props: EditorProps, state: EditorState) {
    super(props, state);

    this.state = {
      content: {
        text: ""
      }
    };

    this.handleValueChange = this.handleValueChange.bind(this);
  }

  public handleValueChange = (value: ReactMdeTypes.Value) => {
    this.props.callback(value);
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
          value={this.props.content}
          onChange={this.handleValueChange}
          commands={ReactMdeCommands.getDefaultCommands()}
          visibility={{
            previewHelp: this.props.previewMode,
            textarea: this.props.previewMode,
            toolbar: this.props.previewMode
          }}
        />
      </div>
    );
  }
}

export default Editor;
