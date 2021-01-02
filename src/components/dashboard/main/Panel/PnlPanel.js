import React from "react";
import {withStyles,Grid,Typography} from '@material-ui/core';
import PropTypes from 'prop-types';

const styles = theme => ({
  root:{
   textAlign:"center",
   color:"white",
  },
  typography:{
    fontFamily:"TitilliumWeb_Regular",
  },
  paper:{
    color:"white",
    backgroundColor:"grey",
    borderColor:"white",
  }
 });

class PnLPanel extends React.Component {
  render() {
    const {classes} = this.props;
    let totalValue = this.props.data.totalValue;
    let principal = this.props.data.openCost;
    let unrealizedPnl = this.props.data.unrealizedPnl;
    let realizedPnl = this.props.data.realizedPnl;

    return (
      <div className={classes.root}>
      <Grid container spacing={4}>
       
        <Grid item sm={3} xs={12}>
          <Typography fontWeight="fontWeightBold" variant="h5"style={this.getNumberStyle(totalValue)} className={classes.typography}>
          {totalValue}
          </Typography>

          <Typography variant="body2">Total</Typography>
        </Grid>

        <Grid item sm={3} xs={12}>
          <Typography fontWeight="fontWeightBold" variant="h5"style={this.getNumberStyle(principal)} className={classes.typography}>
          {principal}
          </Typography>

          <Typography variant="body2">Principal</Typography>
        </Grid>        

        <Grid item sm={3} xs={12}>
          <Typography fontWeight="fontWeightBold" variant="h5"style={this.getNumberStyle(unrealizedPnl)} className={classes.typography}>
          {unrealizedPnl}
          </Typography>

          <Typography variant="body2">Unreal PnL</Typography>
        </Grid>

        <Grid item sm={3} xs={12}>
          <Typography fontWeight="fontWeightBold" variant="h5"style={this.getNumberStyle(realizedPnl)} className={classes.typography}>
          {realizedPnl}
          </Typography>

          <Typography variant="body2">Realized PnL</Typography>
        </Grid>

        </Grid>       
      </div>
    );
  }

  getNumberStyle=(number)=>{
    let num = Number(number);
    if(num>0){
      return {
        color:"#00FF00"
      };
    }else if(num===0){
      return {
        color:"grey"
      };
    }else{
      return {
        color: "#ff0000"
      };
    }

  }
}

PnLPanel.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(PnLPanel);

