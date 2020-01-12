import { React, MVVM, VNode } from "../src"
export class Simple extends MVVM<{ rendered?: Function }>{
    protected $Render(): VNode {
        return <h1 onClick={this.changeName}>this is simple</h1>;
    }
    onRendered() {
        if (this.$props.rendered)
            this.$props.rendered();
    }
    changeName() {

    }
}
export class MouseEvent extends MVVM<{}>{
    private name = "foo"
    protected $Render(): VNode {
        return <h1 onClick={this.changeName}>{this.name}</h1>
    }
    changeName() {
        this.name = this.name + 'o';
    }

}