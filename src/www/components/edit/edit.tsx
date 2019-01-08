import { BaseComponent } from "../../core/BaseComponent";
import { VNode } from "../../core/VNode";
import React from "../../core/react";
import axios from "axios";
import { Component } from "../../core/component-manager";
import $ from "jquery";

/**@import "./edit.scss" */
@Component("edit")
export class Edit extends BaseComponent<{btn:string}>{
    callback:Function=null;
    onRendered(): void {
        this.on("modify",(target,data:{name:string,type:string}[],callback:Function)=>{
            console.log(data);
            this.callback=callback;
            this.$elem.css({display:"block"});
            let input:VNode[]=data.map(item=>{
                return (
                <div className="field-item">
                    <h4 className="field-title">{item.name}</h4>
                    <input className="field-input" type={item.type} name={item.name}/>
                </div>);
            });
            input.forEach(item=>{
                let $dom=$(item.ToDom());
                $dom.insertBefore(this.$elem.find("button"));
            });
        });
    }    
    onSave(){
       let data:{name:string,value:string}[]=[];
       let fields=this.$elem.find(".field-item");
       for(let i=0;i<fields.length;i++){
           let name=$(fields[i]).find(".field-title").text();
           let value:any=$(fields[i]).find(".field-input").val();
           data.push({name:name,value:value});
       }
       this.callback(data);
    }
    protected Render(): VNode {
        return <div class="edit">
            <button onClick={this.onSave.bind(this)}>{this.params.btn}</button>
        </div>
    }
}