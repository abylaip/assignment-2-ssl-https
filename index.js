const express = require("express");
const fs = require("fs");
const https = require("https");

const app = express();
app.use(express.json());

const lastMessage = [];

app.get("/", (req, res) => {
  res.send(lastMessage[lastMessage.length - 1] || "It is alive!");
});

// turn off cert validation to check it on client side
app.post("/post", (req, res) => {
  try {
    lastMessage.push(req.body.message);
    res.status(200).json({ message: `Posted! ${req.body.message}` });
  } catch (err) {
    res.status(404).json({ message: "Something wrong: 500 ->" + err });
  }
});

const credentials = {
  key: fs.readFileSync("./private.pem"),
  cert: fs.readFileSync("./certificate.pem"),
};

const server = https.createServer(credentials, app);

server.listen(3001, () => {
  console.log("Working on port 3001");
});
