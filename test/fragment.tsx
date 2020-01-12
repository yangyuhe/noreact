import { MVVM, VNode, React } from "../src";

export class Fragment extends MVVM<void>{
    protected $Render(): VNode {
        return <fragment>
            <h1>f1</h1>
            <h2>f2</h2>
        </fragment>
    }

}