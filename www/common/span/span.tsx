import { BaseComponent } from "../../core/BaseComponent";
import { VNode } from "../../core/VNode";
import React from "../../core/react";
import { Component } from "../../core/component-manager";

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