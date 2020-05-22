import React , {Component} from "react";
import PropTypes from 'prop-types';

import {Grid,withStyles,Typography, Card} from '@material-ui/core';
const styles = theme => ({
    root:{
        width:"100%",
        minHeight:"100vh",
    },
    droppable:{
        // backgroundColor:"red",
        position:"relative",
        width:"100%",
        paddingBottom:"30px",
        border:"0.5px",
        borderStyle:"solid",
        borderColor:"white",
    },
    footer:{
        position:"absolute",
        color:"black",
        textAlign:"center",
        backgroundColor:"yellow",
        right: "0",
        bottom: "0",
        left: "0",
    }
});

class Droppable extends Component{

    drop = (e) =>{
        e.preventDefault();
        const data = e.dataTransfer.getData('transfer');
        console.log(data);
        e.target.appendChild(document.getElementById(data));
        console.log(e.target);
        console.log("drop");
    }

    allowDrop = (e) =>{
        e.preventDefault();
    }

    preventDrop  = (e) =>{
        e.stopPropagation();
    }
    
    render(){
       const { classes } =this.props;
        
       return ( 
        <div className={classes.root}>
        <Grid container spacing={1} id  = {this.props.id} onDrop={this.drop} onDragOver={this.allowDrop} className={classes.droppable}>
          
            {this.props.children}
            {/* <div className={classes.footer} onDrop={this.preventDrop}>
         
               DRAG HERE
          
           </div> */}
     
        </Grid> 
             
        </div>
      
        );
    }
}

Droppable.propTypes = {
    id:PropTypes.string,
    children:PropTypes.node,
    classes: PropTypes.object.isRequired,
}

export default withStyles (styles)(Droppable);