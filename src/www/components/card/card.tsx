import { BaseComponent } from "../../core/BaseComponent";
import { VNode } from "../../core/VNode";
import React from "../../core/react";
import { Style } from "../../core/Style";

@Style("card")
export class Card extends BaseComponent<CardParam>{
    onRendered(): void {
    }    
    doThing(){
        return (
            <div>
        <div className="name">{this.params.data.name}</div>
        <div className="price">{this.params.data.price}</div>
        <div className="opentime">{this.params.data.opentime}</div>
        </div>
        );
    }
    Render(): VNode {
        return (<div className="detail" onClick={()=>this.params.onClick(this.params.data)}>
            {this.doThing()}
        </div>);
    }
}
export interface Detail{
    name:string,
    price:number,
    opentime:Date,
    closetime?:Date
}
export interface CardParam{
    data:Detail,
    onClick:(info:Detail)=>void
}