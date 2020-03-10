import React, { Component } from "react";
import { connect } from "react-redux";
import Login from "./Login.jsx";
import Signup from "./Signup.jsx";
import ChatMessages from "./ChatMessages.jsx";
import ChatForm from "./ChatForm.jsx";
import ActiveUsers from "./ActiveUsers.jsx";
class UnconnectedApp extends Component {
  cookieChecker = async () => {
    let response = await fetch("/cookieChecker");
    let responseBody = await response.text();
    let body = JSON.parse(responseBody);
    if (body.success) {
      this.props.dispatch({ type: "login-success" });
    }
  };
  render = () => {
    this.cookieChecker();
    if (this.props.login) {
      return (
        <div>
          <div>
            <ChatMessages />
            <ChatForm />
          </div>
          <div>
            <ActiveUsers />
          </div>
        </div>
      );
    }
    return (
      <div>
        <h1>Signup</h1>
        <Signup />
        <h1>Login</h1>
        <Login />
      </div>
    );
  };
}
let mapStateToProps = state => {
  return { login: state.loggedIn };
};
let App = connect(mapStateToProps)(UnconnectedApp);
export default App;
