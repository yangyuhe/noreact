import { MVVM, React, Ref } from "../src";

export class Chapter12 extends MVVM {
    counter: Ref<Counter> = new Ref();
    input: Ref<HTMLElement> = new Ref();
    protected $Render() {
        return <div>
            这里演示如何使用ref属性引用dom和组件实例(注意多数情况下我们没必要直接操作dom)<br />
            1.引用组件<br />
            <button onClick={() => this.add()}>add</button>
            <Counter ref={this.counter}></Counter>
            <br />
            2.引用dom<br />
            <input ref={this.input} type="text" />
            <button onClick={() => this.changeStyle()}>change style</button>
        </div>
    }
    add() {
        this.counter.current.increase();
    }
    changeStyle() {
        this.input.current.style.border = "1px solid red"
    }

}
class Counter extends MVVM {
    count = 0
    protected $Render() {
        return <span>当前计数：{this.count}</span>
    }
    increase() {
        this.count++;
    }
}