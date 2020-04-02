import { MVVM, React } from "../src";

export class Chapter04 extends MVVM {
    protected $Render() {
        return <div>
            <div>这里演示如何构建一个最简单的组件</div>
            <Welcome />
        </div>
    }

}
class Welcome extends MVVM {
    protected $Render() {
        return <div style={{ background: 'black', color: 'white', padding: '10px' }}>"我是一个组件"</div>
    }
}