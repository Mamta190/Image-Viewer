import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import Login from "./screens/login/Login";
import Home from "./screens/home/Home";

class Controller extends Component {
render() {
    return (
      <Router>
        <Route exact path="/" render={(props) => <Login {...props} />} />
        <Route
          exact
          path="/home"
          render={(props) => <Home {...props} baseUrl={this.baseUrl} />}
        />
  </Router>
    );
  }
}

export default Controller;
