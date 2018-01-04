import * as React from "react";
import ReactMde, { ReactMdeCommands, ReactMdeTypes } from "react-mde";

import "font-awesome/css/font-awesome.css";
import "react-mde/lib/styles/css/react-mde-all.css";
import "./Editor.css";

interface EditorState {
  content: ReactMdeTypes.Value;
}

interface EditorProps {
  text: string;
  personName: string;
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
  }

  public render() {
    return (
      <div className="editor content">
        <div className="subtitle is-3">{this.props.personName}</div>
        <ReactMde
          textAreaProps={{
            id: "ta1",
            name: "ta1"
          }}
          value={this.state.content}
          onChange={this.handleValueChange}
          commands={ReactMdeCommands.getDefaultCommands()}
        />
      </div>
    );
  }
}

export default Editor;
