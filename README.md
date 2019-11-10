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

#### To Close
---------------------
On the **Command Prompt** that pops up
1) Ctrl C
2) press Y and Enter to close(If not the port would still be running in the background.)

## React quick guides
index.js is the traditional and actual entry point for all node apps. Note that it render an App component in the root element in public/index.html
```ReactDOM.render(<App />, document.getElementById('root'));```
