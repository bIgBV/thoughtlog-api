import * as React from "react";
import Editor from "../components/Editor";
var Day = function (props) {
    return (React.createElement("div", { className: "day-header" },
        React.createElement("div", { className: "heading-2" }, new Date().toLocaleDateString()),
        React.createElement("div", { className: "day-editor" },
            React.createElement(Editor, { text: "Tell me about your day.." }))));
};
export default Day;
//# sourceMappingURL=Day.js.map