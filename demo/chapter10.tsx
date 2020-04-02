import { MVVM, React } from "../src";

export class Chapter10 extends MVVM {
    protected $Render() {
        return <div>
            这里简单的演示下如何使用继承来扩展已有的组件，假设我们有个常用的Dialog组件NormalDialog
            <NormalDialog title="special dialog" body="content" />
            假如我们想要一个不同样子的header的Dialog，我们可以想下面这么做，我们通过重写header方法可以构造一个新的dialog类SpecialDialog,其他内容均继承旧的NormalDialog
            <SpecialDialog title="special dialog" body="content" />
        </div>
    }

}
class NormalDialog extends MVVM {
    constructor(protected props: { title: string, body: string }) {
        super(props);
    }
    protected $Render() {
        return <div>
            {this.header()}
            {this.body()}
        </div>
    }
    header() {
        return <div style={{ background: 'black', padding: '10px', color: 'white' }}>{this.props.title}</div>
    }
    body() {
        return <div style={{ border: '1px solid black', padding: '10px' }}>{this.props.body}</div>
    }
}
class SpecialDialog extends NormalDialog {
    header() {
        return <div style={{ background: '#123456', padding: '10px', color: 'white' }}>{this.props.title}</div>
    }
}