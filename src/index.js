import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

class Square extends React.Component {
  render() {
    const text = isNaN(this.props.value)
      ? this.props.value
      : String.fromCharCode(this.props.value);

    let className = "square";
    if(this.props.isBlackSquare)
      className += " black-square";
    if(this.props.selected)
      className += " selected";
    if(this.props.isValidMoveCell)
      className += " valid-move";
    return (
      <button className={className} onClick={this.props.onClick}>
        {text}
      </button>
    );
  }
}

class ChessGame extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      layout: [
        [9820, 9822, 9821, 9819, 9818, 9821, 9822, 9820],
        [9823, 9823, 9823, 9823, 9823, 9823, 9823, 9823],
        [ 32 ,  32 ,  32 ,  32 ,  32 ,  32 ,  32 ,  32 ],
        [ 32 ,  32 ,  32 ,  32 ,  32 ,  32 ,  32 ,  32 ],
        [ 32 ,  32 ,  32 ,  32 ,  32 ,  32 ,  32 ,  32 ],
        [ 32 ,  32 ,  32 ,  32 ,  32 ,  32 ,  32 ,  32 ],
        [9817, 9817, 9817, 9817, 9817, 9817, 9817, 9817],
        [9814, 9816, 9815, 9813, 9812, 9815, 9816, 9814]
      ],
      validMoveCells: [
        [false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false]
      ],
      whitesMove: true,
      selectedI: null,
      selectedJ: null,
    };
  }
  findValidMovesCells(i,j) {
    console.log("hgvhgvh")
  }
  handleClick(i, j) {
    if(this.state.layout[i][j] === 32){
      return;
    }
    if(this.state.whitesMove){
      if(this.state.layout[i][j] < 9818){
        this.setState({
          selectedI : i,
          selectedJ : j,
        });
        this.findValidMovesCells(i,j);
      }
    } else {
      if(this.state.layout[i][j] >= 9818){
        this.setState({
          selectedI : i,
          selectedJ : j,
        });
        this.findValidMovesCells(i,j);
      }
    }
  }
  render() {
    return (
      <ChessBoard
        layout={this.state.layout}
        validMoveCells={this.state.validMoveCells}
        handleClick={(i, j) => this.handleClick(i, j)}
        selectedI={this.state.selectedI}
        selectedJ={this.state.selectedJ}
      />
    );
  }
}

class ChessBoard extends React.Component {
  renderSquare(i, j) {
    const isBlackSquare = (i+j)%2 === 1 ? true : false;
    const selected = (i===this.props.selectedI && j===this.props.selectedJ) ? true : false;
    return (
      <Square
        value={this.props.layout[i][j]}
        onClick={() => this.props.handleClick(i, j)}
        selected={selected}
        isBlackSquare={isBlackSquare}
        isValidMoveCell={this.props.validMoveCells[i][j]}
      />
    );
  }
  getRow(i) {
    return (
      <div className="board-row">
        {this.renderSquare(i, 0)}
        {this.renderSquare(i, 1)}
        {this.renderSquare(i, 2)}
        {this.renderSquare(i, 3)}
        {this.renderSquare(i, 4)}
        {this.renderSquare(i, 5)}
        {this.renderSquare(i, 6)}
        {this.renderSquare(i, 7)}
      </div>
    );
  }

  render() {
    return (
      <div>
        {this.getRow(0)}
        {this.getRow(1)}
        {this.getRow(2)}
        {this.getRow(3)}
        {this.getRow(4)}
        {this.getRow(5)}
        {this.getRow(6)}
        {this.getRow(7)}
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<ChessGame />, document.getElementById("root"));
