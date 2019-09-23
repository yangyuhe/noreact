import { MVVM } from "../www/core/MVVM";
import { VNode } from "../www/core/VNode";

export class Fragment extends MVVM<void>{
    protected Render(): VNode {
        return <fragment>
            <h1>f1</h1>
            <h2>f2</h2>
        </fragment>
    }
    
}