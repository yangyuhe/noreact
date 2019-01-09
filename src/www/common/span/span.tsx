import { BaseComponent } from "../../core/BaseComponent";
import { VNode } from "../../core/VNode";
import React from "../../core/react";
import { Component } from "../../core/component-manager";
import { SaveModuleCustomInfo } from "../../core/custominfo-manager";

@Component("span")
export class Span extends BaseComponent<SpanParams>{
    onRendered(): void {
        this.on("result",(target,data:{name:string,value:string}[])=>{
            
            data.forEach(item=>{
                if(item.name=="span border"){
                    this.params.border=item.value;
                    this.$elem.css({border:item.value});
                    return;
                }
                if(item.name=="span background"){
                    this.params.background=item.value;
                    this.$elem.css({background:item.value});
                    return;
                }
                if(item.name=="span height"){
                    this.params.height=item.value;
                    this.$elem.css({height:item.value});
                    return;
                }
            });
            SaveModuleCustomInfo(this._name,this.params);
        });
    }    
    modify(){
        let items=[
            {name:"span border",type:"input",value:""},
            {name:"span background",type:"input",value:""},
            {name:"span height",type:"input",value:""}
        ];

        this.notify("modify",items);
    }
    protected Render(): VNode {
        let style={
            border:this.params.border || '1px solid yellow',
            display:"inline-block",
            height:this.params.height||'30px',
            'background-color':this.params.background||'blue'
        };
        return <span onClick={this.modify.bind(this)} style={style}>{this.children}</span>
    }

}
export interface SpanParams{
    border?:string,
    height?:string,
    background?:string
}