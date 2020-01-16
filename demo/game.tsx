import { MVVM, React, VNode } from "../src";
import "./game.scss";
class Square extends MVVM<{ onClick: Function, value: string }>{
    protected $Render(): VNode {
        return <div className="square" onClick={this.$props.onClick}>
            {this.$props.value}
        </div>
    }
}
class Board extends MVVM<{ squares: string[], onClick: Function }>{
    renderSquare(index: number) {
        return <Square value={this.$props.squares[index]} onClick={() => this.$props.onClick(index)}></Square>
    }
    protected $Render(): VNode {
        return <div>
            <div className="board-row">
                {this.renderSquare(0)}
                {this.renderSquare(1)}
                {this.renderSquare(2)}
            </div>
            <div className="board-row">
                {this.renderSquare(3)}
                {this.renderSquare(4)}
                {this.renderSquare(5)}
            </div>
            <div className="board-row">
                {this.renderSquare(6)}
                {this.renderSquare(7)}
                {this.renderSquare(8)}
            </div>
        </div>
    }


}
export class Game extends MVVM<{}>{
    squares: string[] = Array(9).fill(null);
    historys: string[][] = [];
    xIsNext = true;
    handleClick(index: number) {
        if (this.squares[index]) {
            return;
        }
        let winner = this.calculateWinner(this.squares);
        if (winner) {
            return;
        }

        this.squares[index] = this.xIsNext ? 'x' : 'o';
        this.historys.push(this.squares.slice());
        console.log(this.historys)
        this.xIsNext = !this.xIsNext;
    }
    private calculateWinner(squares): string {
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
                return squares[a];
            }
        }
        return null;
    }
    private jumpTo(move: number) {
        this.squares = this.historys[move];
    }
    protected $Render(): VNode {
        let winner = this.calculateWinner(this.squares);
        let status;
        if (winner) {
            status = winner + " is winner";
        } else
            status = 'Next player: ' + (this.xIsNext ? 'x' : 'o');
        let moves = this.historys.map((step, move) => {
            const desc = move ?
                'Go to move #' + move :
                'Go to game start';
            return (
                <li>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });
        return <div className="game">
            <div className="game-board">
                <Board squares={this.squares} onClick={(index) => { this.handleClick(index) }} />
            </div>
            <div className="game-info">
                <div>{status}</div>
                <ol>{moves}</ol>
            </div>
        </div>
    }
}