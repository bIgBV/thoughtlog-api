import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";
import { BrowserRouter } from 'react-router-dom';
import "./index.css";
ReactDOM.render(React.createElement(BrowserRouter, null,
    React.createElement(App, null)), document.getElementById("root"));
registerServiceWorker();
//# sourceMappingURL=index.js.map