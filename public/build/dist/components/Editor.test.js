import * as React from "react";
import * as ReactDOM from "react-dom";
import Editor from "./Editor";
it("Renders without crashig", function () {
    var div = document.createElement("div");
    ReactDOM.render(React.createElement(Editor, { text: "Test" }), div);
});
describe("Renders react-mde editor", function () {
    it("Renders the editor", function () {
        var div = document.createElement("div");
        ReactDOM.render(React.createElement(Editor, { text: "Test" }), div);
    });
});
//# sourceMappingURL=Editor.test.js.map