var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import * as React from "react";
import ReactMde, { ReactMdeCommands } from "react-mde";
import 'font-awesome/css/font-awesome.css';
import "react-mde/lib/styles/css/react-mde-all.css";
import "./Editor.css";
var Editor = (function (_super) {
    __extends(Editor, _super);
    function Editor() {
        var _this = _super.call(this) || this;
        _this.handleValueChange = function (value) {
            _this.setState({ content: value });
        };
        _this.state = {
            content: {
                text: ""
            }
        };
        return _this;
    }
    Editor.prototype.componentDidMount = function () {
        this.setState({
            content: {
                text: this.props.text
            }
        });
    };
    Editor.prototype.render = function () {
        return (React.createElement("div", { className: "editor" },
            React.createElement(ReactMde, { textAreaProps: {
                    id: "ta1",
                    name: "ta1"
                }, value: this.state.content, onChange: this.handleValueChange, commands: ReactMdeCommands.getDefaultCommands() })));
    };
    return Editor;
}(React.Component));
export default Editor;
//# sourceMappingURL=Editor.js.map