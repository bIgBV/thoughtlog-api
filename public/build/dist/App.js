import * as React from "react";
import "./App.css";
import { Link, Route } from "react-router-dom";
import { Redirect } from "react-router";
import Day from "./pages/Day";
var App = function (props) {
    return (React.createElement("div", null,
        React.createElement("nav", null,
            React.createElement(Link, { to: "/day" }, "Day")),
        React.createElement("div", { className: "App" },
            React.createElement(Route, { path: "/" },
                React.createElement(Redirect, { to: "/day" })),
            React.createElement(Route, { path: "/day", component: Day }))));
};
export default App;
//# sourceMappingURL=App.js.map