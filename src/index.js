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
  // i_check, j_check is the cell to be checked.
  //returns "empty" if empty,
  //        "capture" if occupied by opponent,
  //        "stop" if occupied by self of is off board.
  isFilled(i_check, j_check){
    if(i_check>=8 || j_check>=8 || i_check<0 || j_check<0){
      return "stop";
    }
    let square_value = this.state.layout[i_check][j_check];
    if(square_value === 32){
      return "empty";
    }
    if(this.state.whitesMove){
      if(square_value < 9818 ) {
        return "stop";
      }else{
        return "capture";
      }
    }else{
      if(square_value >= 9818){
        return "stop";
      }else{
        return "capture";
      }
    }

  }
  findValidMovesCells(i,j) {
    let validMoveCells = [
      [false, false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false, false]
    ]
    let piece_selected = this.state.layout[i][j];

    // king
    if(piece_selected === 9812 || piece_selected === 9818 ){
      
      if(this.isFilled(i+1,j) !== "stop"){
        validMoveCells[i+1][j] = true;
      }
      if(this.isFilled(i,j+1) !== "stop"){
        validMoveCells[i][j+1] = true;
      }
      if(this.isFilled(i-1,j) !== "stop"){
        validMoveCells[i-1][j] = true;
      }
      if(this.isFilled(i,j-1) !== "stop"){
        validMoveCells[i][j-1] = true;
      }
      if(this.isFilled(i+1,j+1) !== "stop"){
        validMoveCells[i+1][j+1] = true;
      }
      if(this.isFilled(i+1,j-1) !== "stop"){
        validMoveCells[i+1][j-1] = true;
      }
      if(this.isFilled(i-1,j+1) !== "stop"){
        validMoveCells[i-1][j+1] = true;
      }
      if(this.isFilled(i-1,j-1) !== "stop"){
        validMoveCells[i-1][j-1] = true;
      }
    }

    // queen
    else if(piece_selected === 9813 || piece_selected === 9819 ){
      let add = 1;
      let result = this.isFilled(i+add,j);
      while(result === "empty"){
        validMoveCells[i+add][j] = true;
        add++;
        result = this.isFilled(i+add,j);
      }
      if(result === "capture"){
        validMoveCells[i+add][j] = true;
      }

      add = 1;
      result = this.isFilled(i-add,j);
      while(result === "empty"){
        validMoveCells[i-add][j] = true;
        add++;
        result = this.isFilled(i-add,j);
      }
      if(result === "capture"){
        validMoveCells[i-add][j] = true;
      }

      add = 1;
      result = this.isFilled(i,j+add);
      while(result === "empty"){
        validMoveCells[i][j+add] = true;
        add++;
        result = this.isFilled(i,j+add);
      }
      if(result === "capture"){
        validMoveCells[i][j+add] = true;
      }

      add = 1;
      result = this.isFilled(i,j-add);
      while(result === "empty"){
        validMoveCells[i][j-add] = true;
        add++;
        result = this.isFilled(i,j-add);
      }
      if(result === "capture"){
        validMoveCells[i][j-add] = true;
      }

      add = 1;
      result = this.isFilled(i+add,j+add);
      while(result === "empty"){
        validMoveCells[i+add][j+add] = true;
        add++;
        result = this.isFilled(i+add,j+add);
      }
      if(result === "capture"){
        validMoveCells[i+add][j+add] = true;
      }

      add = 1;
      result = this.isFilled(i-add,j+add);
      while(result === "empty"){
        validMoveCells[i-add][j+add] = true;
        add++;
        result = this.isFilled(i-add,j+add);
      }
      if(result === "capture"){
        validMoveCells[i-add][j+add] = true;
      }

      add = 1;
      result = this.isFilled(i-add,j-add);
      while(result === "empty"){
        validMoveCells[i-add][j-add] = true;
        add++;
        result = this.isFilled(i-add,j-add);
      }
      if(result === "capture"){
        validMoveCells[i-add][j-add] = true;
      }

      add = 1;
      result = this.isFilled(i+add,j-add);
      while(result === "empty"){
        validMoveCells[i+add][j-add] = true;
        add++;
        result = this.isFilled(i+add,j-add);
      }
      if(result === "capture"){
        validMoveCells[i+add][j-add] = true;
      }
    }

    // rook
    else if(piece_selected === 9814 || piece_selected === 9820 ){
      let add = 1;
      let result = this.isFilled(i+add,j);
      while(result === "empty"){
        validMoveCells[i+add][j] = true;
        add++;
        result = this.isFilled(i+add,j);
      }
      if(result === "capture"){
        validMoveCells[i+add][j] = true;
      }

      add = 1;
      result = this.isFilled(i-add,j);
      while(result === "empty"){
        validMoveCells[i-add][j] = true;
        add++;
        result = this.isFilled(i-add,j);
      }
      if(result === "capture"){
        validMoveCells[i-add][j] = true;
      }

      add = 1;
      result = this.isFilled(i,j+add);
      while(result === "empty"){
        validMoveCells[i][j+add] = true;
        add++;
        result = this.isFilled(i,j+add);
      }
      if(result === "capture"){
        validMoveCells[i][j+add] = true;
      }

      add = 1;
      result = this.isFilled(i,j-add);
      while(result === "empty"){
        validMoveCells[i][j-add] = true;
        add++;
        result = this.isFilled(i,j-add);
      }
      if(result === "capture"){
        validMoveCells[i][j-add] = true;
      }
    }

    // bishop
    else if(piece_selected === 9815 || piece_selected === 9821 ){
      let add = 1;
      let result = this.isFilled(i+add,j+add);
      while(result === "empty"){
        validMoveCells[i+add][j+add] = true;
        add++;
        result = this.isFilled(i+add,j+add);
      }
      if(result === "capture"){
        validMoveCells[i+add][j+add] = true;
      }

      add = 1;
      result = this.isFilled(i-add,j+add);
      while(result === "empty"){
        validMoveCells[i-add][j+add] = true;
        add++;
        result = this.isFilled(i-add,j+add);
      }
      if(result === "capture"){
        validMoveCells[i-add][j+add] = true;
      }

      add = 1;
      result = this.isFilled(i-add,j-add);
      while(result === "empty"){
        validMoveCells[i-add][j-add] = true;
        add++;
        result = this.isFilled(i-add,j-add);
      }
      if(result === "capture"){
        validMoveCells[i-add][j-add] = true;
      }

      add = 1;
      result = this.isFilled(i+add,j-add);
      while(result === "empty"){
        validMoveCells[i+add][j-add] = true;
        add++;
        result = this.isFilled(i+add,j-add);
      }
      if(result === "capture"){
        validMoveCells[i+add][j-add] = true;
      }
    }

    // knight
    else if(piece_selected === 9816 || piece_selected === 9822 ){
      if(this.isFilled(i+2,j+1)!=="stop"){
        validMoveCells[i+2][j+1] = true;
      }
      if(this.isFilled(i-2,j+1)!=="stop"){
        validMoveCells[i-2][j+1] = true;
      }
      if(this.isFilled(i+2,j-1)!=="stop"){
        validMoveCells[i+2][j-1] = true;
      }
      if(this.isFilled(i-2,j-1)!=="stop"){
        validMoveCells[i-2][j-1] = true;
      }


      if(this.isFilled(i+1,j+2)!=="stop"){
        validMoveCells[i+1][j+2] = true;
      }
      if(this.isFilled(i-1,j+2)!=="stop"){
        validMoveCells[i-1][j+2] = true;
      }
      if(this.isFilled(i+1,j-2)!=="stop"){
        validMoveCells[i+1][j-2] = true;
      }
      if(this.isFilled(i-1,j-2)!=="stop"){
        validMoveCells[i-1][j-2] = true;
      }
    }

    // white pawn
    else if(piece_selected === 9817){
      if(this.isFilled(i-1,j) === "empty"){
        validMoveCells[i-1][j] = true;
        if(i===6 && this.isFilled(i-2,j) === "empty"){
          validMoveCells[i-2][j] = true;
        }
      }
      if(this.isFilled(i-1,j+1) === "capture" ){
        validMoveCells[i-1][j+1] = true;
      }
      if(this.isFilled(i-1,j-1) === "capture" ){
        validMoveCells[i-1][j-1] = true;
      }
    }

    // black pawn
    else if(piece_selected === 9823){
      if(this.isFilled(i+1,j) === "empty"){
        validMoveCells[i+1][j] = true;
        if(i===1 && this.isFilled(i+2,j) === "empty"){
          validMoveCells[i+2][j] = true;
        }
      }
      if(this.isFilled(i+1,j+1) === "capture" ){
        validMoveCells[i+1][j+1] = true;
      }
      if(this.isFilled(i+1,j-1) === "capture" ){
        validMoveCells[i+1][j-1] = true;
      }
    }

    return validMoveCells;
  }
  handleClick(i, j) {
    if(this.state.layout[i][j] === 32 && this.state.validMoveCells[i][j]===false){
      return;
    }
    if(this.state.validMoveCells[i][j]===true){
        let layout = this.state.layout.slice();
        layout[i][j] = layout[this.state.selectedI][this.state.selectedJ];
        layout[this.state.selectedI][this.state.selectedJ] = 32;
        let validMoveCells = [
          [false, false, false, false, false, false, false, false],
          [false, false, false, false, false, false, false, false],
          [false, false, false, false, false, false, false, false],
          [false, false, false, false, false, false, false, false],
          [false, false, false, false, false, false, false, false],
          [false, false, false, false, false, false, false, false],
          [false, false, false, false, false, false, false, false],
          [false, false, false, false, false, false, false, false]
        ]

        let whitesMove = this.state.whitesMove ? false : true;
        
        this.setState({
          layout : layout,
          validMoveCells : validMoveCells,
          whitesMove : whitesMove,
          selectedI : null,
          selectedJ : null
        })
        return;
    }
    if(this.state.whitesMove){
      if(this.state.layout[i][j] < 9818){
        this.setState({
          selectedI : i,
          selectedJ : j,
        });

        this.setState({
          validMoveCells : this.findValidMovesCells(i,j)
        });
      }
    } else {
      if(this.state.layout[i][j] >= 9818){
        this.setState({
          selectedI : i,
          selectedJ : j,
        });

        this.setState({
          validMoveCells : this.findValidMovesCells(i,j)
        });
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
        key={i*8+j}
        value={this.props.layout[i][j]}
        onClick={() => this.props.handleClick(i, j)}
        selected={selected}
        isBlackSquare={isBlackSquare}
        isValidMoveCell={this.props.validMoveCells[i][j]}
      />
    );
  }
  getRow(i) {
    let cells = []
    for(let j = 0; j < 8; j++){
        cells.push(this.renderSquare(i, j))
    }
    return (
      <div className="board-row" key={i}>
        {cells}
      </div>
    );
  }
  render() {
    let rows = []
    for(let i = 0; i < 8; i++){
        rows.push(this.getRow(i))
    }
    return (
      <div>
        {rows}
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<ChessGame />, document.getElementById("root"));
