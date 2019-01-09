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
        this.on("save",(target,index,data)=>{
            if(target.Name=="span"){
                let span=this.params.lists[index].span;
                if(!span)
                    (span as any)={};
                data.forEach(item=>{
                    span[item.name]=item.value;
                });
                this.params.lists[index].span=span;
            }
            axios.post("/save",{name:this.Name,data:this.params}).then(res=>{
                alert("成功");
            },err=>{
                alert("失败");
                console.log(err);
            })
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
                    {this.params.lists.map((item,index) => {
                        return <FactItem index={index} {...item}></FactItem>;
                    })}
                    
                </div>
                <button onClick={this.modify.bind(this)}>修改</button>
            </div>);
    }
}
