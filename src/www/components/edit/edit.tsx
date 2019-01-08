import { BaseComponent } from "../../core/BaseComponent";
import { VNode } from "../../core/VNode";
import React from "../../core/react";
import axios from "axios";
import { Component } from "../../core/component-manager";

@Component("edit")
export class Edit extends BaseComponent<{btn:string}>{
    onRendered(): void {
    }    
    onSave(){
        axios.post("/save",{name:"edit",data:{btn:"修改"}}).then(res=>{
            console.log(res);
        });
        this.notify("bug",1,2,3);
    }
    protected Render(): VNode {
        return <div>
            <button onClick={this.onSave.bind(this)}>{this.params.btn}</button>
        </div>
    }
}