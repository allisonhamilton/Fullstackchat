import React, { Component } from "react";
import { connect } from "react-redux";
class UnconnectedSignup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: ""
    };
  }
  handleUsernameChange = event => {
    console.log("new username", event.target.value);
    this.setState({ username: event.target.value });
  };
  handlePasswordChange = event => {
    console.log("new password", event.target.value);
    this.setState({ password: event.target.value });
  };
  handleSubmit = async evt => {
    evt.preventDefault();
    console.log("signup form submitted");
    let data = new FormData();
    data.append("username", this.state.username);
    data.append("password", this.state.password);
    let response = await fetch("/signup", {
      method: "POST",
      body: data,
      credentials: "include"
    });
    let responseBody = await response.text();
    console.log("responseBody from signup", responseBody);
    let body = JSON.parse(responseBody);
    console.log("parsed body", body);
    if (!body.success) {
      alert("Signup failed, username taken!");
      return;
    }
    alert("Signup successful");
    this.setState({ username: "", password: "" });
    this.props.dispatch({ type: "changeInt", chatting: true });
    this.props.dispatch({ type: "login-success" });
  };
  render = () => {
    return (
      <form onSubmit={this.handleSubmit}>
        Username
        <input
          value={this.state.username}
          type="text"
          onChange={this.handleUsernameChange}
        />
        Password
        <input
          value={this.state.password}
          type="text"
          onChange={this.handlePasswordChange}
        />
        <input type="submit" />
      </form>
    );
  };
}
let Signup = connect()(UnconnectedSignup);
export default Signup;
