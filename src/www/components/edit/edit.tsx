import { BaseComponent } from "../../core/BaseComponent";
import { VNode } from "../../core/VNode";
import React from "../../core/react";
import axios from "axios";
import { Component } from "../../core/component-manager";

/**@import "./edit.scss" */
@Component("edit")
export class Edit extends BaseComponent<{btn:string}>{
    onRendered(): void {
        this.on("modify",(target,data:{name:string,type:string}[])=>{
            console.log(data);
            this.$elem.css({display:"block"});
            let input:VNode[]=data.map(item=>{
                return (
                <div>
                    <h4 class="field-title">{item.name}</h4>
                    <input class="field-input" type={item.type} name={item.name}/>
                </div>);
            });
            input.forEach(item=>{
                this.$elem.append(item.ToDom());
            });

        });
    }    
    onSave(){
       
    }
    protected Render(): VNode {
        return <div class="edit">
            <button onClick={this.onSave.bind(this)}>{this.params.btn}</button>
        </div>
    }
}