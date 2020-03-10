let express = require("express");
let multer = require("multer");
let upload = multer({
  dest: __dirname + "/uploads/"
});
let app = express();
let cookieParser = require("cookie-parser");
app.use(cookieParser());
let reloadMagic = require("./reload-magic.js");
let passwords = {};
let sessions = {};
let messages = [];
let activeUsers = [];
reloadMagic(app);
app.use("/images/", express.static(__dirname + "/uploads"));
app.use("/", express.static("build"));
app.get("/messages", function(req, res) {
  let sessionId = req.cookies.sid;
  let username = sessions[sessionId];
  if (username === undefined) {
    res.send("Nice try postman");
    return;
  }
  recentMessages = messages.slice(-20);
  console.log("username to see messages", username);
  res.send(JSON.stringify(recentMessages));
});

app.post("/newmessage", upload.single("img"), (req, res) => {
  console.log("*** inside new message");
  console.log("body", req.body, req.file);
  let sessionId = req.cookies.sid;
  let username = sessions[sessionId];
  console.log("username", username);
  let msg = req.body.msg;
  let time = new Date();
  let img = req.file;
  let showImg = undefined;
  if (img !== undefined) {
    showImg = "/images/" + img.filename;
  }
  let newMsg = {
    username: username,
    message: msg,
    imgPath: showImg,
    time: time
  };
  console.log("new message", newMsg);
  messages = messages.concat(newMsg);
  console.log("updated messages", messages);
  res.send(JSON.stringify({ success: true }));
});
app.get("/deleteUserMsgs", upload.none(), (req, res) => {
  let sessionId = req.cookies.sid;
  let username = sessions[sessionId];
  messages = messages.filter(user => {
    return user.username !== username;
  });
  res.send(JSON.stringify({ success: true }));
});
app.post("/login", upload.none(), (req, res) => {
  console.log("**** I'm in the login endpoint");
  console.log("this is the parsed body", req.body);
  let username = req.body.username;
  let enteredPassword = req.body.password;
  let expectedPassword = passwords[username];
  console.log("expected password", expectedPassword);
  if (enteredPassword === expectedPassword) {
    console.log("password matches");
    let sessionId = generateId();
    console.log("generated id", sessionId);
    sessions[sessionId] = username;
    let time = new Date();
    let userLogOn = {
      username: username,
      message: "is logged on!",
      time: time
    };
    messages = messages.concat(userLogOn);
    res.cookie("sid", sessionId);
    res.send(JSON.stringify({ success: true }));
    return;
  }
  res.send(JSON.stringify({ success: false }));
});
app.get("/userActive", upload.none(), (req, res) => {
  console.log("!!!!!!!!!!!Is this user been acttive?");
  let recentMsgs = messages.filter(msg => {
    let timeMs = msg.time;
    console.log(Date.now() - timeMs.getTime() < 30000);
    return Date.now() - timeMs.getTime() < 300000;
  });
  console.log("in recent messags", recentMsgs);
  let recentUsers = {};
  recentMsgs.forEach(msg => {
    recentUsers[msg.username] = true;
  });
  activeUsers = Object.keys(recentUsers);
  console.log("active userss", activeUsers);
  res.send(JSON.stringify({ success: true, users: activeUsers }));
  return;
});

let generateId = () => {
  return "" + Math.floor(Math.random() * 100000000);
};
app.post("/signup", upload.none(), (req, res) => {
  console.log("**** I'm in the signup endpoint");
  console.log("this is the body", req.body);
  let username = req.body.username;
  if (passwords[username] === undefined) {
    let enteredPassword = req.body.password;
    passwords[username] = enteredPassword;
    let sessionId = generateId();
    sessions[sessionId] = username;
    res.cookie("sid", sessionId);
    console.log("sessionId", sessionId);
    console.log("passwords object", passwords);
    let time = new Date();
    let userLogOn = {
      username: username,
      message: "is now logged on!",
      time: time
    };
    messages = messages.concat(userLogOn);
    res.send(JSON.stringify({ success: true }));
    return;
  }
  res.send(JSON.stringify({ success: false }));
});

app.post("/logout", upload.none(), (req, res) => {
  console.log("***I'm trying to logout!");
  let sessionId = req.cookies.sid;
  let username = sessions[sessionId];
  if (username === undefined) {
    res.send(JSON.stringify({ success: false }));
    return;
  }

  delete sessions[sessionId];
  res.cookie("sid", 0, { expires: -1 });
  res.send(JSON.stringify({ success: true }));
  return;
});
app.get("/cookieChecker", upload.none(), (req, res) => {
  let sessionId = req.cookies.sid;
  let username = sessions[sessionId];
  if (username !== undefined) {
    res.send(JSON.stringify({ success: true }));
    return;
  }
  res.send(JSON.stringify({ success: false }));
});
app.all("/*", (req, res, next) => {
  res.sendFile(__dirname + "/build/index.html");
});
app.listen(4000, () => {
  console.log("server started");
});
