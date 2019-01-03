const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const axios = require("axios");
const port = process.env.PORT || 4001;
const index = require("./routes/index");
const app = express();
app.use(index);
const server = http.createServer(app);
const io = socketIo(server);
io.on("connection", socket => {
  console.log("New client connected"), 
    setInterval(() => getApiAndEmit(socket),1000);
    setInterval(() => getStatusesAndEmit(socket),1000);
  socket.on("disconnect", () => console.log("Client disconnected"));
});
const getApiAndEmit = async socket => {
  try {
    const res = await axios.get(
      "http://localhost:2222/service/strategy/performances"
    );
    //console.log(res.data);
    socket.emit("FromStratPerf", res.data);
    
  } catch (error) {
    console.error('Error: ${error.code}');
  }
};
const getStatusesAndEmit = async socket => {
  try {
    const res = await axios.get(
      "http://localhost:2222/service/strategy/statuses"
    );
    //console.log(res.data);
    socket.emit("FromStrategyStatuses", res.data);
    
  } catch (error) {
    console.error('Error: ${error.code}');
  }
};
server.listen(port, () => 
server.close(),
console.log(`Listening on port ${port}`)

);