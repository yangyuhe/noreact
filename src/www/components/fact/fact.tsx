import { BaseComponent } from "../../core/BaseComponent";
import { VNode } from "../../core/VNode";
import { Component } from "../../core/component-manager";
import React from "../../core/react";
import axios from "axios";
import { FactItem, FactItemParams } from "./fact-item";

/**@import "./fact.scss" */
@Component("fact")
export class MdFact extends BaseComponent<{ title: string, lists: FactItemParams[] }>{
    onRendered(): void {
        this.on("bug", (target, ...args: any[]) => {
            console.log("fuck", target, args);
        });
        this.on("save",()=>{
            axios.post("/save",{
                name:this._name,
                data:this.params
            }).then(()=>{
                alert("成功");
            },err=>{
                alert("失败");
            });
        });
    }
    modify(){
        this.notify("modify",[{
            name:"title",
            type:"input",
            value:"title"
        }],(data:{name:string,value:string}[])=>{
            data.forEach(item=>{
                if(item.name=="title"){
                    this.$elem.find(".fact-title").text(item.value);
                }
            });
        });
        
    }
    protected Render(): VNode {
        return (
            <div className="fact">
                <h1 className="fact-title">{this.params.title}</h1>
                <div className="fact-list">
                    {this.params.lists.map(item => {
                        return <FactItem {...item}></FactItem>;
                    })}
                    
                </div>
                <button onClick={this.modify.bind(this)}>修改</button>
            </div>);
    }
}
