import React from "react";

class PnLPanel extends React.Component {
  render() {
    const totalValue = this.props.data.totalValue;
    const unrealizedPnl = this.props.data.unrealizedPnl;
    const realizedPnl = this.props.data.realizedPnl;

    return (
      <div className="row">
        <div className="col">
          <h4 style={this.getNumberStyle(totalValue)}>{totalValue}</h4>
          <h6>Total</h6>
        </div>
        <div className="col">
          <h4 style={this.getNumberStyle(realizedPnl)}>{realizedPnl}</h4>
          <h6>Realized PnL</h6>
        </div>
        <div className="col">
          <h4 style={this.getNumberStyle(unrealizedPnl)}>{unrealizedPnl}</h4>
          <h6>Unreal PnL</h6>
        </div>
      </div>
    );
  }

  getNumberStyle(number) {
    return {
      color: number >= 0 ? "#03c03c" : "#ff6666"
    };
  }
}

export default PnLPanel;
