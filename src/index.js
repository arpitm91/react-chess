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
    if(this.props.isCapturedCell)
      className += " capture-cell";
    if(this.props.lastMoveStart)
      className += " lastMoveStart";
    if(this.props.lastMoveEnd)
      className += " lastMoveEnd";
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
      captureMoveCells: [
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
      lastMoveStartI: null,
      lastMoveStartJ: null,
      lastMoveEndI: null,
      lastMoveEndJ: null,
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
    let captureMoveCells = [
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
      
      let result = this.isFilled(i+1,j)
      if(result !== "stop"){
        validMoveCells[i+1][j] = true;
      }
      if(result === "capture"){
        captureMoveCells[i+1][j] = true;
      }

      result = this.isFilled(i,j+1)
      if(result !== "stop"){
        validMoveCells[i][j+1] = true;
      }
      if(result === "capture"){
        captureMoveCells[i][j+1] = true;
      }

      result = this.isFilled(i-1,j)
      if(result !== "stop"){
        validMoveCells[i-1][j] = true;
      }
      if(result === "capture"){
        captureMoveCells[i-1][j] = true;
      }

      result = this.isFilled(i,j-1)
      if(result !== "stop"){
        validMoveCells[i][j-1] = true;
      }
      if(result === "capture"){
        captureMoveCells[i][j-1] = true;
      }

      result = this.isFilled(i+1,j+1)
      if(result !== "stop"){
        validMoveCells[i+1][j+1] = true;
      }
      if(result === "capture"){
        captureMoveCells[i+1][j+1] = true;
      }

      result = this.isFilled(i+1,j-1)
      if(result !== "stop"){
        validMoveCells[i+1][j-1] = true;
      }
      if(result === "capture"){
        captureMoveCells[i+1][j-1] = true;
      }

      result = this.isFilled(i-1,j+1)
      if(result !== "stop"){
        validMoveCells[i-1][j+1] = true;
      }
      if(result === "capture"){
        captureMoveCells[i-1][j+1] = true;
      }

      result = this.isFilled(i-1,j-1)
      if(result !== "stop"){
        validMoveCells[i-1][j-1] = true;
      }
      if(result === "capture"){
        captureMoveCells[i-1][j-1] = true;
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
        captureMoveCells[i+add][j] = true;
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
        captureMoveCells[i-add][j] = true;
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
        captureMoveCells[i][j+add] = true;
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
        captureMoveCells[i][j-add] = true;
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
        captureMoveCells[i+add][j+add] = true;
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
        captureMoveCells[i-add][j+add] = true;
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
        captureMoveCells[i-add][j-add] = true;
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
        captureMoveCells[i+add][j-add] = true;
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
        captureMoveCells[i+add][j] = true;
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
        captureMoveCells[i-add][j] = true;
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
        captureMoveCells[i][j+add] = true;
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
        captureMoveCells[i][j-add] = true;
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
        captureMoveCells[i+add][j+add] = true;
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
        captureMoveCells[i-add][j+add] = true;
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
        captureMoveCells[i-add][j-add] = true;
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
        captureMoveCells[i+add][j-add] = true;
      }
    }

    // knight
    else if(piece_selected === 9816 || piece_selected === 9822 ){
      let result = this.isFilled(i+2,j+1);
      if(result!=="stop"){
        validMoveCells[i+2][j+1] = true;
        if(result==="capture"){
          captureMoveCells[i+2][j+1] = true;
        }
      }

      result = this.isFilled(i-2,j+1);
      if(result!=="stop"){
        validMoveCells[i-2][j+1] = true;
        if(result==="capture"){
          captureMoveCells[i-2][j+1] = true;
        }
      }

      result = this.isFilled(i+2,j-1);
      if(result!=="stop"){
        validMoveCells[i+2][j-1] = true;
        if(result==="capture"){
          captureMoveCells[i+2][j-1] = true;
        }
      }

      result = this.isFilled(i-2,j-1);
      if(result!=="stop"){
        validMoveCells[i-2][j-1] = true;
        if(result==="capture"){
          captureMoveCells[i-2][j-1] = true;
        }
      }



      result = this.isFilled(i+1,j+2);
      if(result!=="stop"){
        validMoveCells[i+1][j+2] = true;
        if(result==="capture"){
          captureMoveCells[i+1][j+2] = true;
        }
      }

      result = this.isFilled(i-1,j+2);
      if(result!=="stop"){
        validMoveCells[i-1][j+2] = true;
        if(result==="capture"){
          captureMoveCells[i-1][j+2] = true;
        }
      }

      result = this.isFilled(i+1,j-2);
      if(result!=="stop"){
        validMoveCells[i+1][j-2] = true;
        if(result==="capture"){
          captureMoveCells[i+1][j-2] = true;
        }
      }

      result = this.isFilled(i-1,j-2);
      if(result!=="stop"){
        validMoveCells[i-1][j-2] = true;
        if(result==="capture"){
          captureMoveCells[i-1][j-2] = true;
        }
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
        captureMoveCells[i-1][j+1] = true;
      }
      if(this.isFilled(i-1,j-1) === "capture" ){
        validMoveCells[i-1][j-1] = true;
        captureMoveCells[i-1][j-1] = true;
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
        captureMoveCells[i+1][j+1] = true;
      }
      if(this.isFilled(i+1,j-1) === "capture" ){
        validMoveCells[i+1][j-1] = true;
        captureMoveCells[i+1][j-1] = true;
      }
    }

    return [validMoveCells,captureMoveCells];
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
        let captureMoveCells = [
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
        let lastMoveStartI = this.state.selectedI;
        let lastMoveStartJ = this.state.selectedJ;
        
        this.setState({
          layout : layout,
          validMoveCells : validMoveCells,
          captureMoveCells : captureMoveCells,
          whitesMove : whitesMove,
          selectedI : null,
          selectedJ : null,
          lastMoveEndI:i,
          lastMoveEndJ:j,
          lastMoveStartI:lastMoveStartI,
          lastMoveStartJ:lastMoveStartJ,
        })
        return;
    }
    if(this.state.whitesMove){
      if(this.state.layout[i][j] < 9818){
        let result = this.findValidMovesCells(i,j);
        let validMoveCells = result[0];
        let captureMoveCells = result[1];
        this.setState({
          selectedI : i,
          selectedJ : j,
          validMoveCells : validMoveCells,
          captureMoveCells : captureMoveCells,
        });
      }
    } else {
      if(this.state.layout[i][j] >= 9818){
        let result = this.findValidMovesCells(i,j);
        let validMoveCells = result[0];
        let captureMoveCells = result[1];
        this.setState({
          selectedI : i,
          selectedJ : j,
          validMoveCells : validMoveCells,
          captureMoveCells : captureMoveCells,
        });
      }
    }
  }
  render() {
    const turn = this.state.whitesMove ? "White's Turn" : "Black's Turn";
    return (
      <div>
        <ChessBoard
          layout={this.state.layout}
          validMoveCells={this.state.validMoveCells}
          captureMoveCells={this.state.captureMoveCells}
          handleClick={(i, j) => this.handleClick(i, j)}
          selectedI={this.state.selectedI}
          selectedJ={this.state.selectedJ}
          lastMoveStartI={this.state.lastMoveStartI}
          lastMoveStartJ={this.state.lastMoveStartJ}
          lastMoveEndI={this.state.lastMoveEndI}
          lastMoveEndJ={this.state.lastMoveEndJ}
        />
        <div className="center">
          <h1>{turn}</h1>
          {/* <button>New Game</button> */}
        </div>
      </div>
    );
  }
}

class Numbering extends React.Component {
  render() {
    return (
      <tr>
        <td/>
        <td className="cellNumber">a</td>
        <td className="cellNumber">b</td>
        <td className="cellNumber">c</td>
        <td className="cellNumber">d</td>
        <td className="cellNumber">e</td>
        <td className="cellNumber">f</td>
        <td className="cellNumber">g</td>
        <td className="cellNumber">h</td>
      </tr>
    );
  }
}

class ChessBoard extends React.Component {
  renderSquare(i, j) {
    const isBlackSquare = (i+j)%2 === 1 ? true : false;
    const selected = (i===this.props.selectedI && j===this.props.selectedJ) ? true : false;
    const lastMoveStart = (i===this.props.lastMoveStartI && j===this.props.lastMoveStartJ) ? true : false;
    const lastMoveEnd = (i===this.props.lastMoveEndI && j===this.props.lastMoveEndJ) ? true : false;
    return (
      <td>
        <Square
          key={i*8+j}
          value={this.props.layout[i][j]}
          onClick={() => this.props.handleClick(i, j)}
          selected={selected}
          isBlackSquare={isBlackSquare}
          lastMoveStart={lastMoveStart}
          lastMoveEnd={lastMoveEnd}
          isValidMoveCell={this.props.validMoveCells[i][j]}
          isCapturedCell={this.props.captureMoveCells[i][j]}
        />
      </td>
    );
  }
  getRow(i) {
    let cells = []
    for(let j = 0; j < 8; j++){
        cells.push(this.renderSquare(i, j))
    }
    return (
      <tr key={i}>
        <td className="cellNumber">{8-i}</td>
        {cells}
        <td className="cellNumber">{8-i}</td>
      </tr>
    );
  }
  render() {
    let rows = []
    for(let i = 0; i < 8; i++){
        rows.push(this.getRow(i))
    }
    return (
      <table className="boardTable">
        <tbody>
          <Numbering/>
          {rows}
          <Numbering/>
        </tbody>
      </table>
    );
  }
}

// ========================================

ReactDOM.render(<ChessGame />, document.getElementById("root"));
