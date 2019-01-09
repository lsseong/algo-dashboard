const express = require("express");
const port = process.env.PORT || 4001;
const index = require("./routes/index");
const app = express();

const http = require("http");
const server = http.createServer(app);
const socketIo = require("socket.io");
const io = socketIo(server);
const axios = require("axios");

app.use(express.json());

var cors = require('cors');
app.use(cors());
app.use(index);

var host = '';
var portNumber = '';
var conStatus =true;

io.on("connection", socket => {
  console.log("New client connected"); 
  var interval = setInterval(() => getApiAndEmit(socket),1000);
  socket.on("disconnect", () => {
    host =  '',
    portNumber = '',
    console.log("Client disconnected");
   clearInterval(interval);
  });
  if(conStatus===false){
    host =  '',
    portNumber = '',
    socket.disconnect();
    clearInterval(interval);
  }
 
});

const getApiAndEmit = async socket => {
  //console.log("h"+host);
  //console.log("p"+portNumber);
 
    try {
      const res = await axios.get(
        "http://"+host+":"+portNumber+"/service/strategy/performances"
      );
      //console.log(res.data);
      socket.emit("FromStratPerf", res.data);
      
    } catch (error) {
      console.error('Error: ${error.code}');
      app.get('/url', async (req, res)=>{
        res.send({ response: "dc" });
      });
  

    }
};    

app.post('/url', async (req, res)=>{
  console.log("host"+req.body.host);
  console.log("port"+req.body.port);
  console.log("status"+req.body.status);
  host = req.body.host;
  portNumber = req.body.port;
  conStatus =req.body.status;
});



server.listen(port, () => 
server.close(),
console.log(`Listening on port ${port}`)

);