import { MVVM } from "../../core/MVVM";
import { VNode } from "../../core/VNode";
import React from "../../core/react";
import { Component } from "../../core/component-manager";
@Component({name:"housecard"})
export class HouseCard extends MVVM<{}>{
    private color="yellow";
    protected Render(): VNode {
        return <div>
            <h1 onClick={this.onclick.bind(this)} style={{color:this.color}}>hello</h1>
        </div>;
    }
    onclick(){
        this.color="red";
        this.$Refresh();
    }
}