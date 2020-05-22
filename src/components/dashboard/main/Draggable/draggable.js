import React , {Component} from "react";
import PropTypes from 'prop-types';

import {Grid,withStyles,Card} from '@material-ui/core';
const styles = theme => ({
    draggable:{
        width:"100%",
        backgroundColor:"green",
        padding:"10px",
    }
});


class Draggable extends Component {


    drag = (e) =>{
        e.dataTransfer.setData('transfer', e.target.id);
        console.log("drag");
    }

    preventDrop = (e) =>{
        e.preventDefault();
        console.log("drag over");
    }

    drop =(id) =>(e) =>{
        console.log(id);
        console.log(e.target);
        e.preventDefault();
        const data = e.dataTransfer.getData('transfer');
        
        // data.appendChild(document.getElementById(id));
        
        e.target.removeChild(document.getElementById(e.target.id));
        e.target.appendChild(document.getElementById(data));
        console.log(data);
    }

    render(){
        const { classes } = this.props;

        return (
            <Grid item xs={12} id={this.props.id} 
                  draggable = "true" 
                  onDragStart={this.drag} 
                  onDragOver={this.preventDrop} 
                  onDrop={this.drop(this.props.id)} 
                  className={classes.draggable}>

                {this.props.children}
            </Grid>
        );
    }
}

Draggable.propTypes = {
    id:PropTypes.string,
    children:PropTypes.node,
    classes: PropTypes.object.isRequired,
}

export default withStyles (styles) (Draggable);