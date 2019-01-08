import { BaseComponent } from "../../core/BaseComponent";
import { VNode } from "../../core/VNode";
import { Component } from "../../core/component-manager";
import React from "../../core/react";
import { FactItem, FactItemParams } from "./fact-item";

/**@import "./fact.scss" */
@Component("fact")
export class MdFact extends BaseComponent<FactItemParams[]>{
    
    onRendered(): void {
        console.log("hello")
    }    
    protected Render(): VNode {
        return <div className="fact-list">
        {this.params.map(item=>{
            return <FactItem {...item}></FactItem>;
        })}
        </div>;
    }
}