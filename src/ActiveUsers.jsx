import React, { Component } from "react";
import { connect } from "react-redux";

class UnconnectedActiveUsers extends Component {
  componentDidMount = () => {
    let updateUsers = async () => {
      let response = await fetch("/userActive");
      let responseBody = await response.text();
      let userBody = JSON.parse(responseBody);
      this.props.dispatch({ type: "isUserActive", content: userBody.users });
    };
    setInterval(updateUsers, 500);
  };
  render = () => {
    let usersMustBeActive = y => {
      return <li>{y}</li>;
    };
    return (
      <div class="two-col">
        <ul>{this.props.username.map(usersMustBeActive)}</ul>
      </div>
    );
  };
}
let mapStateToProps = state => {
  return {
    username: state.active
  };
};
let ActiveUsers = connect(mapStateToProps)(UnconnectedActiveUsers);

export default ActiveUsers;
