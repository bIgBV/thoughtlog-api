import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";

import { BrowserRouter } from "react-router-dom";

import { ReadCookie } from "./services/UserService";

import "normalize.css";
import "./index.css";

let loginData = {
  token: ""
};
const nameCookie = ReadCookie("token");

const isLoggedIn = nameCookie !== undefined;

if (nameCookie) {
  loginData = {
    token: nameCookie
  };
}

ReactDOM.render(
  <BrowserRouter>
    <App isLoggedIn={isLoggedIn} loginData={loginData} />
  </BrowserRouter>,
  document.getElementById("root") as HTMLElement
);
registerServiceWorker();
