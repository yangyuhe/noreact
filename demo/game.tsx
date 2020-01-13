import { MVVM, React, VNode } from "../src";
import "./game.scss";
class Square extends MVVM<{ onClick: Function, value: string }>{
    protected $Render(): VNode {
        return <div className="square" onClick={this.$props.onClick}>
            {this.$props.value}
        </div>
    }
}
class Board extends MVVM<{}>{
    squares: string[] = Array(9).fill(null);
    renderSquare(index: number) {
        return <Square value={this.squares[index]} onClick={() => this.handleClick(index)}></Square>
    }
    handleClick(index: number) {
        this.squares[index] = 'x';
    }
    protected $Render(): VNode {
        const status = 'Next player: X';
        return <div>
            <div className="status">{status}</div>
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
class Game extends MVVM<void>{
    protected $Render(): VNode {
        return <div className="game">
            <div className="game-board">
                <Board />
            </div>
            <div className="game-info">
                <div>{/* status */}</div>
                <ol>{/* TODO */}</ol>
            </div>
        </div>
    }
}
let game = new Game();

class Test extends MVVM<void>{
    hide = false
    protected $Render(): VNode {
        return <div>
            {this.hide ? <TestItem></TestItem> : null}
            <button onClick={() => this.toggle()}>toggle</button>
        </div>
    }
    toggle() {
        this.hide = !this.hide;
    }

}
class TestItem extends MVVM<{}>{
    time = new Date();
    protected $Render(): VNode {
        console.log("render...")
        return <React.Fragment>
            {this.time}
        </React.Fragment>
    }
    $onInit() {
        setInterval(() => {
            this.time = new Date();
        }, 1000);
    }
}
let test = new Test();
document.addEventListener("DOMContentLoaded", () => {
    test.$AppendTo(document.body);
});