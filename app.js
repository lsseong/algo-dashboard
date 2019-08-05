const express = require("express");
const port = process.env.PORT || 4001;
const index = require("./routes/index");
const app = express();

const http = require("http");
const server = http.createServer(app);
const socketIo = require("socket.io");
const io = socketIo(server);

app.use(express.json());

var cors = require("cors");
app.use(cors());
app.use(index);

var host = "";
var portNumber = "";
var conStatus = true;

io.on("connection", socket => {
  console.log("New client connected");

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
  if (conStatus === false) {
    (host = ""), (portNumber = ""), socket.disconnect();
    clearInterval(interval);
  }
});

app.post("/url", async (req, res) => {
  console.log("host: " + req.body.host);
  console.log("port: " + req.body.port);
  console.log("status: " + req.body.status);
  host = req.body.host;
  portNumber = req.body.port;
  conStatus = req.body.status;
});

server.listen(
  port,
  () => server.close(),
  console.log(`Listening on port ${port}`)
);
