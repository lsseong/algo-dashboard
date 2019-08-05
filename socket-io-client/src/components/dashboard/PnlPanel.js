import React from "react";
import {withStyles,Grid,Typography} from '@material-ui/core';
import PropTypes from 'prop-types';

const styles = theme => ({
  root:{
   textAlign:"center",
  },
  typography:{
    fontFamily:"TitilliumWeb_Regular",
  }
 });

class PnLPanel extends React.Component {
  render() {
    const {classes} = this.props;
    var totalValue = this.props.data.totalValue;
    var unrealizedPnl = this.props.data.unrealizedPnl;
    var realizedPnl = this.props.data.realizedPnl;

    totalValue = Number(totalValue).toFixed(2);
    unrealizedPnl = Number(unrealizedPnl).toFixed(2);
    realizedPnl = Number(realizedPnl).toFixed(2);

    return (
      <div className={classes.root}>
      <Grid container spacing={4}>
        <Grid item sm={4}>
          <Typography variant="h5"style={this.getNumberStyle(totalValue)} className={classes.typography}>
          {totalValue}
          </Typography>

          <Typography variant="body1">
            Total
          </Typography>
        </Grid>

        <Grid item sm={4}>

        <Typography variant="h5"style={this.getNumberStyle(realizedPnl)} className={classes.typography}>
          {totalValue}
          </Typography>

          <Typography variant="body1">
            Realized PnL
          </Typography>

        </Grid>

        <Grid item sm={4}>

        <Typography variant="h5"style={this.getNumberStyle(unrealizedPnl)} className={classes.typography}>
          {totalValue}
        </Typography>

        <Typography variant="body1">
            Unreal PnL
          </Typography>

        </Grid>

      </Grid>
      </div>
    );
  }

  getNumberStyle(number) {
    return {
      color: number >= 0 ? "#00FF00" : "#ff0000"
    };
  }
}

PnLPanel.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(PnLPanel);

