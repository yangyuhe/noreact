import { MVVM, React } from "../src";

export class Chapter07 extends MVVM {
    count = 0;
    protected $Render() {
        return <div>
            这里想你展示如何在NoReact中使用事件处理,类似还有onScroll,onMouseOver等所有标准事件
            <br />
            <button onClick={() => { this.add() }}>add</button>
            <span>计数:{this.count}</span>
        </div>
    }
    add() {
        this.count++;
    }
}