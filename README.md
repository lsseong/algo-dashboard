# algo-dashboard
This project uses the following Javascript technology to host a dashboard:
1) npm - package manager to start the runtime. It points to start script in the package.json file, which is "react-scripts start"
2) react - "react-scripts start" runs the React app in dev mode, as well as hot module reloading. It contains the following two main folders: src (contains app.js. index.js and components subfolder) and public (contains index.html). 
3) Google material (previous design was using Bootstrap)
4) amCharts - for graphs
5) ag-grids - for tables


## How to run and close

### Windows
------------------------------------------------------------------------------------------------------------------------------------------
#### Install Node.js
Download installer from https://nodejs.org/en/


#### To Run
------------------------------------- 
Double click the **run.bat** file  

1) A Command Prompt will pop up (**DO NOT CLOSE**) ,minimise it if you find it disturbing
2) The Dashboard will automatically open on your default browser (**Open on Chrome or Firefox** does not work on Internet Explorer)
3) Otherwise open URL http://localhost:3000/

#### To Close
---------------------
On the **Command Prompt** that pops up
1) Ctrl C
2) press Y and Enter to close(If not the port would still be running in the background.)

## React quick guides
Public folder contains index.html, where "root" element is defined.

index.js is the traditional and actual entry point for all node apps. It render an App component in the root element:
```ReactDOM.render(<App />, document.getElementById('root'));```

App component is defined and exported from app.js

## REST End-Points To Get Strategy Data
User will specify the hostname and port to connect, then the dashboard will connect to the following REST end points to get strategy information:

| End Point                          | Description                                        |
| ---------------------------------- |:--------------------------------------------------:|
| service/strategy/performances      | To get running strategy names and performance info |
| service/strategy/statuses          | To get running strategy statuses                   |
| service/{strategy-name}            | Streaming data (server-side events)                |


#### /service/strategy/performances
Example: http://localhost:2222/service/strategy/performances

~~~
[ {
  "id" : "AlterBuySell-EURUSD",
  "time" : "18-11-19 19:21:53",
  "totalValue" : 34.0,
  "cash" : 29.0,
  "unrealizedPnl" : 5.0,
  "realizedPnl" : 29.0
} ]
~~~

#### /service/strategy/statuses
Example: http://localhost:2222/service/strategy/statuses

~~~
[ {
  "id" : "AlterBuySell-EURUSD",
  "name" : "AlterBuySell-EURUSD",
  "time" : 1574075758354,
  "status" : "RUNNING",
  "parameters" : {
    "tradeAmt" : "100000.00",
    "longOnly" : "true",
    "security" : "EURUSD",
    "marketOrderAllowed" : "true",
    "frequency" : "5[SECOND]"
  }
} ]
~~~




#### /service/{strategy-name}
Example - http://localhost:2222/service/AlterBuySell-EURUSD

~~~
event: quote
data: {"time":"19:31:06.512","status":"TRADING","security":"EURUSD","bidPrice":1.06087,"askPrice":1.06087}

event: bar
data: {"time":"2019-11-18 19:31:08","symbol":"EURUSD","open":1.0608,"high":1.06088,"low":1.0608,"close":1.06088,"volume":0}

event: commentary
data: {"time":"19:31:08.535","comment":"Raised a buy order"}

event: signal
data: {"time":"19:31:08.536","symbol":"EURUSD","signal":0.0,"commentary":"","analytics":{"sma10":1.0608,"sma20":1.0607285}}

event: order
data: {"time":"19:31:08.535","uuid":"b8649781-eecb-42be-a01b-50d5ff31bd10","clientOrderId":"sim.1.183","state":"COMPLETE","order":{"symbol":"EURUSD","side":"BUY","qty":100000,"type":"MARKET","limitPrice":0.0,"tif":"DAY"},"totalFill":100000,"avgPrice":1.06088}

event:portfolio
data:{"id":"AlterBuySell-IBM","time":"02-01-21 14:15:30","totalValue":1508.6,"openCost":1504.7,"unrealizedPnl":0.4,"realizedPnl":3.5}

event:position
data:{"time":"14:15:30.086","symbol":"IBM","position":10,"principal":1504.7,"unrealizedPnl":0.4,"realizedPnl":3.5}

event: analytic
data:{"time":"18:29:13.303","key":"EURUSD","name":"sma20","value":1.059927}

~~~
