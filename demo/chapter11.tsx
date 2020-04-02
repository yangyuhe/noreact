import { MVVM, React } from "../src";

export class Chapter11 extends MVVM {
    protected $Render() {
        let sidebar = <div>这是sidebar</div>;
        let body = <div>这是body</div>
        return <div>
            这里演示更复杂的组件示例<br />
            1.组件的属性可以传递任何js变量，甚至包括其他组件实例<br />
            <Page sidebar={sidebar} body={body} />
            2.组件的
        </div>
    }
}
class Page extends MVVM {
    constructor(private props: { sidebar: any, body: any }) {
        super(props);
    }
    protected $Render() {
        return <div style={{ display: 'flex' }}>
            <div style={{ width: '100px', border: '1px solid black' }}>
                {this.props.sidebar}
            </div>
            <div style={{ flex: '1 1 auto', border: '1px solid red' }}>
                {this.props.body}
            </div>
        </div>
    }

}