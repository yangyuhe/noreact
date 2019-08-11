import { BaseComponent } from "../../core/BaseComponent";
import { VNode } from "../../core/VNode";
import React from "../../core/react";
import { Component } from "../../core/component-manager";
@Component({name:"housecard"})
export class HouseCard extends BaseComponent<{}>{
    private color="yellow";
    protected $Template(): VNode {
        return <div>
            <h1 onClick={this.onclick.bind(this)} style={{color:this.color}}>hello</h1>
        </div>;
    }
    onclick(){
        this.color="red";
        this.$Refresh();
    }
}