import {MVVM} from "../www/core/MVVM"
import React from "../www/core/react";
import {VNode} from "../www/core/VNode";
export class Simple extends MVVM<{}>{
    protected Render(): VNode {
        return <h1 onClick={this.changeName}>this is simple</h1>;
    }
    changeName(){
        
    }
}
export class MouseEvent extends MVVM<{}>{
    private name="foo"
    protected Render(): VNode {
        return <h1 onClick={this.changeName}>{this.name}</h1>
    }
    changeName(){
        this.name=this.name+'o';
    }

}