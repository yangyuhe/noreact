import { BaseComponent } from "../../core/BaseComponent";
import { VNode } from "../../core/VNode";
import React from "../../core/react";
import { Component } from "../../core/component-manager";
import { SaveModuleCustomInfo } from "../../core/custominfo-manager";

@Component("span")
export class Span extends BaseComponent<SpanParams>{
    constructor(params:SpanParams){
        super(params);
        this.params.background=this.params.background||'blue';
        this.params.height=this.params.height||'30px';
        this.params.border=this.params.border||'1px solid yellow';
    }
    onRendered(): void {
    }    
    modify(){
        let items=[
            {name:"border",type:"input",value:this.params.border},
            {name:"background",type:"input",value:this.params.background},
            {name:"height",type:"input",value:this.params.height}
        ];

        this.notify("modify",items,(data:{name:string,value:string}[])=>{
            data.forEach(item=>{
                if(item.name=="border"){
                    this.$elem.css({border:item.value});
                    return;
                }
                if(item.name=="background"){
                    this.$elem.css({background:item.value});
                    return;
                }
                if(item.name=="height"){
                    this.$elem.css({height:item.value});
                    return;
                }
            });

            this.emit("save",this.params.index,data);
        });
    }
    protected Render(): VNode {
        let style={
            border:this.params.border,
            display:"inline-block",
            height:this.params.height,
            'background-color':this.params.background,
        };
        return <span onClick={this.modify.bind(this)} style={style}>{this.children}</span>
    }

}
export interface SpanParams{
    border?:string,
    height?:string,
    background?:string,
    index:number
}