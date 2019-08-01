import React, { Component } from "react";
import Dashboard from "./components/dashboard/Dashboard";
import {withStyles,TextField,Grid,Button,AppBar,Toolbar} from '@material-ui/core';
import PropTypes from 'prop-types';

const CssTextField = withStyles({
  root: {
    '& label.Mui-focused': {
      color: 'white',
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: 'white',
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: 'white',
      },
      '&:hover fieldset': {
        borderColor: 'white',
      },
      '&.Mui-focused fieldset': {
        borderColor: 'white',
      },
    },
  },
})(TextField);



const styles = theme => ({
 formgroup:{
   marginTop:"5px",
   marginBottom:"5px",
 },

 appbar:{
  backgroundColor:"#404040"
 },

 textfield:{
  minWidth:"120px",
 },

 button:{
   fontSize:"15px",
   color:"white",
   borderColor:"white",
   marginTop:"2px",
 },
 
 labelProps:{
   color:"white",
 },

});

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initStrat: "",
      connectstatus: "Connect",
      host: "",
      port: "",
      disabled: false,
      initData: false
    };
    this.conStatus = false;
  }

  //when component mount fetch 1st strategy name
  initConnection=(host, port)=>{
    const URL =
      "http://" + host + ":" + port + "/service/strategy/performances";
    fetch(URL)
      .then(response => response.json())
      .then(data => this.setState({ initStrat: data[0].id, initData: true }),()=>console.log(this.state.initData));
  }

  //when clicked connection
  handleConnection =() => {

    //when host and port is not empty
    if (this.state.host !== "" && this.state.port !== "") {
      //when the status button is connect
      if (this.state.connectstatus === "Connect") {
        //call initial connection
        this.initConnection(this.state.host, this.state.port);

        //setstate of button and textbox
        this.setState({
          connectstatus: "Disconnect",
          disabled: true
        });
        //set connect status
        this.conStatus = true;
        //send the host ,port,status to server side
        fetch("http://localhost:4001/url", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            host: this.state.host,
            port: this.state.port,
            status: this.conStatus
          })
        });

        //when the status button is disconnect
      } else if (this.state.connectstatus === "Disconnect") {
        //set connection to false
        this.conStatus = false;
        //set state
        this.setState({
          connectstatus: "Connect",
          disabled: false,
          initData: false
        });

        //send connection info to server side
        fetch("http://localhost:4001/url", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            host: this.state.host,
            port: this.state.port,
            status: this.conStatus
          })
        });
      }
    } else {
      //when fields are empty
      alert("Please Enter the Host And Port");
    }

  };

  //change the textfields state
  connectionInput = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  //send first strategy to Strategy list when rendering DOM
  render() {
    const { initStrat } = this.state;
    const { host } = this.state;
    const { port } = this.state;
    const { initData } = this.state;
    const { classes } = this.props;
    return (
      <div>
          <Grid container spacing={2}>
            <Grid item xs={12}>
            <AppBar position="static" color="inherit" className={classes.appbar}>
               <Toolbar  variant="dense">
              {/* First Row - input fields and buttons */}

              <Grid container spacing={2} className={classes.formgroup}>

              {/* The local host text field */}
                <Grid item className={classes.textfield}>
                <CssTextField
                required
                id="outlined-required"
                label="Hostname"
                variant="outlined"
                name="host"
                value={this.state.host}
                onChange={this.connectionInput}
                disabled={this.state.disabled}

                InputLabelProps={{                
                  shrink:true,
                  className:classes.labelProps
                }}
                InputProps={{
                  style:{
                    fontSize:12,
                    color:"white",
                  }
                }}
                />
                </Grid>

                {/* The port text field */}
                <Grid item className={classes.textfield}>
                <CssTextField
                required
                id="outlined-required"
                label="Port"
                color="inherit"
                name="port"
                variant="outlined"
                value={this.state.port}
                onChange={this.connectionInput}
                disabled={this.state.disabled}
                InputLabelProps={{
                  shrink:true,
                  className:classes.labelProps
                }}

                InputProps={{
                  style:{
                    fontSize:12,
                    color:"white",
                  }
                }}
                />
                </Grid>

                {/* Connect Button */}
                <Grid item >
                <Button 
                size="large"
                className={classes.button}
                variant="outlined" color="inherit" 
                onClick={this.handleConnection}>
                
                {this.state.connectstatus}
                </Button>
                </Grid>
               
              </Grid>
              </Toolbar>
              </AppBar>
              
            </Grid>
                {/* Second Row - Main Body */}
              <Grid item xs={12}>
                  <div>
                    {initData 
                    ? (
                      <Dashboard url={initStrat} host={host} port={port} />
                    ) :null
                    
                    }
                    </div>
              </Grid>
            </Grid>
            
  
         
      </div>
    );
  }
}
App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(App);
