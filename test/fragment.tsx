import { MVVM, VNode, React } from "../src";

export class Fragment extends MVVM<void>{
    protected $Render(): VNode {
        return <React.Fragment>
            <h1>f1</h1>
            <h2>f2</h2>
        </React.Fragment>
    }

}