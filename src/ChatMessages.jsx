import React, { Component } from "react";
import { connect } from "react-redux";
class UnconnectedChatMessages extends Component {
  componentDidMount = () => {
    let updateMessages = async () => {
      if (!this.props.chatting) {
        clearInterval(myInterval);
        this.props.dispatch({ type: "logout" });
      }
      let response = await fetch("/messages");
      let responseBody = await response.text();
      console.log("response from messages", responseBody);
      let parsed = JSON.parse(responseBody);
      console.log("parsed", parsed);
      this.props.dispatch({
        type: "set-messages",
        messages: parsed
      });
    };
    let myInterval = setInterval(updateMessages, 500);
  };
  render = () => {
    let msgToElement = e => {
      if (e.imgPath === undefined) {
        return (
          <li>
            <b>{e.username}:</b> {e.message} <sub>{e.time}</sub>
          </li>
        );
      }
      return (
        <li>
          <b>{e.username}:</b> {e.message}
          <img src={e.imgPath} height="200px" width="200px" />
          <sub>{e.time}</sub>
        </li>
      );
    };
    return (
      <div>
        <ul>{this.props.messages.map(msgToElement)}</ul>
      </div>
    );
  };
}
let mapStateToProps = state => {
  return {
    messages: state.msgs,
    loggedIn: state.loggedIn,
    chatting: state.chatting
  };
};
let Chat = connect(mapStateToProps)(UnconnectedChatMessages);
export default Chat;
