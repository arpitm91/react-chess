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
      <td key={i*8+j}>
        <Square
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
        <td className="cellNumber">{i+1}</td>
        {cells}
        <td className="cellNumber">{i+1}</td>
      </tr>
    );
  }
  render() {
    let rows = []
    for(let i = 7; i >=0 ; i--){
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

class Turn extends React.Component {
  render() {
    const turn = this.props.whitesMove ? "White's Turn" : "Black's Turn";
    return (
      <h1>{turn}</h1>
    )
  }
}

class History extends React.Component {
  render() {
    let rows = []
    for(let i = 0; i< this.props.history.length; i+=2){
      let cells = [
        <td className="sl-no" key={i+"number"}>
          {(i/2+1) + "."}
        </td>,
        <td key={i}
          onMouseEnter={() => this.props.historyHover(i)}
          onMouseLeave={() => this.props.historyHover(null)}
        >
          <button 
            onClick={() => this.props.historyClick(i)}
          >
            {this.props.history[i]}
          </button>
        </td>
      ]
      if (i+1<this.props.history.length){
        cells.push(
          <td key={i+1}
            onMouseEnter={() => this.props.historyHover(i+1)}
            onMouseLeave={() => this.props.historyHover(null)}
          >
            <button 
              onClick={() => this.props.historyClick(i+1)}
            >
              {this.props.history[i+1]}
            </button>
          </td>
        )
      }
      rows.push(
        <tr key={i}>
          {cells}
        </tr>
      )
    }
    return (
      <div>
        <table className="history">
          <thead>
            <tr>
              <th colSpan="3">
                <button
                  onClick={() => this.props.historyClick(-1)}
                  onMouseEnter={() => this.props.historyHover(-1)}
                  onMouseLeave={() => this.props.historyHover(null)}
                >
                  New Game
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows}
          </tbody>
        </table>
      </div>
    )
  }
}

class ChessGame extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      layout: [[
        [9814, 9816, 9815, 9813, 9812, 9815, 9816, 9814],
        [9817, 9817, 9817, 9817, 9817, 9817, 9817, 9817],
        [ 32 ,  32 ,  32 ,  32 ,  32 ,  32 ,  32 ,  32 ],
        [ 32 ,  32 ,  32 ,  32 ,  32 ,  32 ,  32 ,  32 ],
        [ 32 ,  32 ,  32 ,  32 ,  32 ,  32 ,  32 ,  32 ],
        [ 32 ,  32 ,  32 ,  32 ,  32 ,  32 ,  32 ,  32 ],
        [9823, 9823, 9823, 9823, 9823, 9823, 9823, 9823],
        [9820, 9822, 9821, 9819, 9818, 9821, 9822, 9820]
      ]],
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
      enPassantI: [null],
      enPassantJ: [null],
      lastMoveStartI: [null],
      lastMoveStartJ: [null],
      lastMoveEndI: [null],
      lastMoveEndJ: [null],
      history:[],
      currentView:0,
    };
  }
  // i_check, j_check is the cell to be checked.
  //returns "empty" if empty,
  //        "capture" if occupied by opponent,
  //        "stop" if occupied by self of is off board.
  isFilled(i_check, j_check){
    let currentView = this.state.layout.length-1;
    if(i_check>=8 || j_check>=8 || i_check<0 || j_check<0){
      return "stop";
    }
    let square_value = this.state.layout[currentView][i_check][j_check];
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
    let currentView = this.state.layout.length-1;
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
    let piece_selected = this.state.layout[currentView][i][j];

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
      if(this.state.enPassantI[currentView]===i+1 && this.state.enPassantJ[currentView]===j+1){
        validMoveCells[i+1][j+1] = true;
        captureMoveCells[i+1][j+1] = true;
      }
      if(this.state.enPassantI[currentView]===i+1 && this.state.enPassantJ[currentView]===j-1){
        validMoveCells[i+1][j-1] = true;
        captureMoveCells[i+1][j-1] = true;
      }
    }

    // black pawn
    else if(piece_selected === 9823){
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
      if(this.state.enPassantI[currentView]===i-1 && this.state.enPassantJ[currentView]===j+1){
        validMoveCells[i-1][j+1] = true;
        captureMoveCells[i-1][j+1] = true;
      }
      if(this.state.enPassantI[currentView]===i-1 && this.state.enPassantJ[currentView]===j-1){
        validMoveCells[i-1][j-1] = true;
        captureMoveCells[i-1][j-1] = true;
      }
    }

    return [validMoveCells,captureMoveCells];
  }
  handleClick(i, j) {
    let currentView = this.state.layout.length-1;
    if(this.state.layout[currentView][i][j] === 32 && this.state.validMoveCells[i][j]===false){
      return;
    }
    if(this.state.validMoveCells[i][j]===true && this.state.selectedI!==null && this.state.selectedJ!==null){
      let layout = JSON.parse(JSON.stringify(this.state.layout))
      let currentLayout = JSON.parse(JSON.stringify(layout[currentView]))
      let piece_selected = currentLayout[this.state.selectedI][this.state.selectedJ];

      const files = ["a","b","c","d","e","f","g","h"]
      let text = (piece_selected === 9823 || piece_selected === 9817)
        ? ""
        : String.fromCharCode(piece_selected);
      if(currentLayout[i][j] !== 32 || 
          (//for en passant
            (piece_selected === 9823 || piece_selected === 9817) 
            && 
            (this.state.enPassantI[currentView]===i && this.state.enPassantJ[currentView]===j)
          )) {
        if (piece_selected === 9823 || piece_selected === 9817) {
          text += files[this.state.selectedJ]
        }
        text += "x";
      }
      text+= files[j] + (i+1);
      if((piece_selected === 9823 || piece_selected === 9817) && (this.state.enPassantI[currentView]===i && this.state.enPassantJ[currentView]===j)) {
        text += "e.p."
      }
      let history = this.state.history.slice();
      history.push(text);

      currentLayout[i][j] = piece_selected;
      currentLayout[this.state.selectedI][this.state.selectedJ] = 32;
      //for en passant
      if(piece_selected === 9823 && (this.state.enPassantI[currentView]===i && this.state.enPassantJ[currentView]===j)){
        currentLayout[i+1][j] = 32;
      } else if (piece_selected === 9817 && (this.state.enPassantI[currentView]===i && this.state.enPassantJ[currentView]===j)){
        currentLayout[i-1][j] = 32;
      } 
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
      let lastMoveStartI = this.state.lastMoveStartI.slice();
      lastMoveStartI.push(this.state.selectedI);
      let lastMoveStartJ = this.state.lastMoveStartJ.slice();
      lastMoveStartJ.push(this.state.selectedJ);

      let lastMoveEndI = this.state.lastMoveEndI.slice();
      lastMoveEndI.push(i);
      let lastMoveEndJ = this.state.lastMoveEndJ.slice();
      lastMoveEndJ.push(j);

      //en passant
      let enPassantI = this.state.enPassantI.slice();
      enPassantI.push(null);
      let enPassantJ = this.state.enPassantJ.slice();
      enPassantJ.push(null);

      if (piece_selected === 9823 && this.state.selectedI - i === 2) {
        enPassantI[currentView+1] = i + 1;
        enPassantJ[currentView+1] = j;
      } else if(piece_selected === 9817 && i - this.state.selectedI === 2) {
        enPassantI[currentView+1] = i - 1;
        enPassantJ[currentView+1] = j;
      }

      layout.push(currentLayout);

      currentView = currentView+1;
      
      this.setState({
        layout : layout,
        validMoveCells : validMoveCells,
        captureMoveCells : captureMoveCells,
        whitesMove : whitesMove,
        selectedI : null,
        selectedJ : null,
        lastMoveEndI:lastMoveEndI,
        lastMoveEndJ:lastMoveEndJ,
        lastMoveStartI:lastMoveStartI,
        lastMoveStartJ:lastMoveStartJ,
        enPassantI:enPassantI,
        enPassantJ:enPassantJ,
        history:history,
        currentView:currentView,
      })
      return;
    }
    if(this.state.whitesMove){
      if(this.state.layout[currentView][i][j] < 9818){
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
      if(this.state.layout[currentView][i][j] >= 9818){
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
  historyHover(turn) {
    let currentView = turn === null 
      ? this.state.layout.length-1 
      : turn+1;
    // alert(currentView + " " + turn)
    this.setState({
      currentView:currentView,
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
      selectedI: null,
      selectedJ: null,
    })
  }
  historyClick(turn) {
  }
  render() {
    let currentView = this.state.currentView;
    console.log("rendering");
    return (
      <div>
        <ChessBoard
          layout={this.state.layout[currentView]}
          validMoveCells={this.state.validMoveCells}
          captureMoveCells={this.state.captureMoveCells}
          handleClick={(i, j) => this.handleClick(i, j)}
          selectedI={this.state.selectedI}
          selectedJ={this.state.selectedJ}
          lastMoveStartI={this.state.lastMoveStartI[currentView]}
          lastMoveStartJ={this.state.lastMoveStartJ[currentView]}
          lastMoveEndI={this.state.lastMoveEndI[currentView]}
          lastMoveEndJ={this.state.lastMoveEndJ[currentView]}
        />
        <div className="center">
          <Turn whitesMove={this.state.whitesMove}/>
          <History 
            history={this.state.history}
            historyHover={(turn) => this.historyHover(turn)}
            historyClick={(turn) => this.historyClick(turn)}
          />
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<ChessGame />, document.getElementById("root"));
