import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";

import { BrowserRouter } from 'react-router-dom';

import { ReadCookie } from "./services/CookieService";

import "normalize.css";
import "./index.css";

let loginData = {};
const isLoggedIn = ReadCookie("name") !== undefined;

if (ReadCookie("name") !== undefined) {
  loginData = {
    userName: ReadCookie("name")
  };
}

ReactDOM.render(
<BrowserRouter>
  <App 
    isLoggedIn={isLoggedIn}
    loginData={loginData}
  />
</BrowserRouter>,
document.getElementById("root") as HTMLElement);
registerServiceWorker();
