import { MVVM, React } from "../src";

export class Chapter08 extends MVVM {
    show = true;
    students = [{ id: 1, name: 'Tom' }, { id: 2, name: 'lilin' }]
    protected $Render() {
        return <div>
            这里向你展示条件渲染和列表渲染
            <br />
            1.条件渲染<br />
            {this.show ? <span>展示</span> : <span>隐藏</span>}
            <button onClick={() => { this.toggle() }}>toggle</button>
            <br />
            2.列表渲染，注意这里的key,虽然大多数时候没有key也可以正常工作，但是它的作用是维持非受控组件的状态<br />
            <ul>
                {this.students.map(item => (<li key={item.id}>{item.id}:{item.name}</li>))}
            </ul>

        </div>
    }
    toggle() {
        this.show = !this.show;
    }

}