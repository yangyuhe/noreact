import { BaseComponent } from "../../core/BaseComponent";
import { VNode } from "../../core/VNode";
import React from "../../core/react";

export class Span extends BaseComponent<{border?:string}>{
    onRendered(): void {
        
    }    
    modify(){
        let items=[
            {name:"span border",type:"input",value:""},
            {name:"span background",type:"input",value:""},
            {name:"span height",type:"input",value:""}
        ];

        this.notify("modify",items,(data:{name:string,value:string}[])=>{
            
            data.forEach(item=>{
                if(item.name=="span border"){
                    this.$elem.css({border:item.value});
                    return;
                }
                if(item.name=="span background"){
                    this.$elem.css({background:item.value});
                    return;
                }
                if(item.name=="span height"){
                    this.$elem.css({height:item.value});
                    return;
                }
            });
        });
    }
    protected Render(): VNode {
        return <span onClick={this.modify.bind(this)} style={`boder:${this.params.border};display:inline-block`}>{this.children}</span>
    }

}