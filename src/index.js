import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  console.log('square props', props)
    return (
      <button className= {props.winner?.includes(props.squareIndex) ? "square active" : "square"}
        onClick={props.onClick}>
        {props.value}
      </button>
    );
}

class Board extends React.Component {

  renderSquare(i) {
    return (
      <Square 
        squareIndex = {i}
        winner={this.props.winner}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        />
    );
  }

  renderBoardRows(num) {
    let rows = [];
    for(let j=num; j < num+3; j++) {
      rows.push(this.renderSquare(j))
    }
    return rows
  }

  renderBoardColumns() {
    let columns = [];
    for(let j=0; j < 9; j+=3) {
        columns.push(<div className="board-row">
                        {this.renderBoardRows(j)}
                    </div>)
    }
    return columns
  }

  render() {
    const gameBoard = this.renderBoardColumns()
    return (
      <div>{gameBoard}</div>
    )
  }
}

class Game extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      history: [{
        squares:Array(9).fill(null),
        squarePosition:String,
      }],
      stepNumber: 0,
      xIsNext: true,
      sortDesc: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber +1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    console.log(`squares ${squares}`)
    if (this.calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        squarePosition: i}]),
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length,
    });
  }

 calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return lines[i];
      }
    }
    return null;
  }

  handleToggle() {
    this.setState({
      sortDesc: !this.state.sortDesc,
    });
  }
  
  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = this.calculateWinner(current.squares);
    const sortDesc = this.state.sortDesc;
    
    console.log(history)
    let moves = history.map((step, move) => {
      console.log(step, move)
      let player = (move % 2 === 0) ? 'O' : 'X';
      let position = history[move].squarePosition
      const desc = move ?
        'Go to move #' + move + ' by player: ' + player + ' square position: ' + position :
        'Go to game start';
      if (step === current){
        return (
          <li key={move}>
            <button onClick={() => this.jumpTo(move)}><b>{desc}</b></button>
          </li>
        )
      }
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      )
    })
    console.log(moves)
    if (sortDesc !== true) {
      moves = moves.reverse();
    }
    let status;
    if (winner) {
      console.log(winner)
      status = 'Winner: ' + (!this.state.xIsNext ? 'X' : 'O');
    } else if (moves.length === 10){
      status = 'Game is a draw'
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }
    
    return (
      <div className="game">
        <div className="game-board">
          <Board 
          winner={winner}
          squares={current.squares}
          onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div onClick={() => this.handleToggle()} className="wrg-toggle">Reverse Move List Order
            <input className="wrg-toggle-input" type="checkbox" aria-label="Toggle Button"></input>
          </div>
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);



