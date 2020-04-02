import { MVVM, React } from "../src";

export class Chapter05 extends MVVM {
    protected $Render() {
        return <div>
            <div>这里演示如何传递属性给组件</div>
            <Counter num1={1} num2={2} />
        </div>
    }

}
class Counter extends MVVM {
    constructor(private props: { num1: number, num2: number }) {
        super(props);
    }
    protected $Render() {
        return <div style={{ background: 'black', color: 'white', padding: '10px' }}>
            我是一个计算器组件
            <div>
                {this.props.num1}+{this.props.num2}={this.props.num1 + this.props.num2}
            </div>
        </div>
    }

}