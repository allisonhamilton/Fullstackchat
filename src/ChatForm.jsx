import React, { Component } from "react";
import { connect } from "react-redux";
class UnconnectedChatForm extends Component {
  constructor(props) {
    super(props);
    this.state = { message: "", image: null };
  }
  handleMessageChange = event => {
    console.log("new message", event.target.value);
    this.setState({ message: event.target.value });
  };
  handleSubmit = event => {
    event.preventDefault();
    console.log("form submitted");
    let data = new FormData();
    data.append("msg", this.state.message);
    data.append("img", this.state.image);
    fetch("/newmessage", {
      method: "POST",
      body: data,
      credentials: "include"
    });
    this.setState({ message: "", image: null });
  };
  onChangeUploadPhoto = ev => {
    this.setState({ image: event.target.files[0] });
  };

  onClickLogOut = event => {
    fetch("/logout", { method: "POST", body: "", credentials: "include" });
    console.log("on click hit");
    this.props.dispatch({ type: "changeInt", chatting: false });
  };
  onClickDeleteUserMessages = async () => {
    let response = await fetch("/deleteUserMsgs");
    console.log("hi there", response);
    let responseBody = await response.text();
    console.log(
      "r**************************esponse from messages mmm",
      responseBody
    );
    return JSON.parse(responseBody);
  };

  render = () => {
    return (
      <div>
        <form
          onSubmit={this.handleSubmit}
          action="/image"
          method="POST"
          enctype="multipart/form-data"
        >
          <input
            value={this.state.message}
            onChange={this.handleMessageChange}
            type="text"
          />
          <input type="submit" value="Send Message" />
          <input
            type="file"
            name="picture"
            accept="/images/*"
            onChange={this.onChangeUploadPhoto}
          />
        </form>
        <div>
          <button onClick={this.onClickDeleteUserMessages}>
            Delete All My Messages
          </button>
        </div>
        <div>
          <button onClick={this.onClickLogOut}>LOG ME OUT!</button>
        </div>
      </div>
    );
  };
}

let mapStateToProps = state => {
  return {
    messages: state.msgs
  };
};
let ChatForm = connect(mapStateToProps)(UnconnectedChatForm);
export default ChatForm;
