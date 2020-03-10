import { createStore } from "redux";
let reducer = (state, action) => {
  if (action.type === "logout") {
    return { ...state, loggedIn: false };
  }
  if (action.type === "login-success") {
    return { ...state, loggedIn: true };
  }
  if (action.type === "set-messages") {
    return { ...state, msgs: action.messages };
  }
  if (action.type === "changeInt") {
    return { ...state, chatting: action.chatting };
  }
  if (action.type === "isUserActive") {
    return { ...state, active: action.content };
  }
  return state;
};
const store = createStore(
  reducer,
  { msgs: [], image: {}, loggedIn: false, chatting: true, active: [] },
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
export default store;
