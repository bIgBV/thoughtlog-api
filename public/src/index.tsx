import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";

import { BrowserRouter } from 'react-router-dom';

import "normalize.css";
import "./index.css";

ReactDOM.render(
<BrowserRouter>
  <App />
</BrowserRouter>,
document.getElementById("root") as HTMLElement);
registerServiceWorker();
