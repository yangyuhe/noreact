import { BaseComponent } from "../../core/BaseComponent";
import { VNode } from "../../core/VNode";
import { Component } from "../../core/component-manager";
import React from "../../core/react";
import { CardItem, CardItemParams } from "./card-item";

/**@import "./card.scss" */
@Component("card")
export class Card extends BaseComponent<CardItemParams[]>{
    onRendered(): void {
        console.log("hello")
    }    
    protected Render(): VNode {
        // debugger;
        return (<div className="card-list">
            {this.params.map(item=>{
                return <CardItem {...item}></CardItem>;
            })}
        </div>);
    }
}