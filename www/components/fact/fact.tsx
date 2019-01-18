import { BaseComponent } from "../../core/BaseComponent";
import { VNode } from "../../core/VNode";
import { Component } from "../../core/component-manager";
import React from "../../core/react";
import axios from "axios";
import { FactItem, FactItemParams } from "./fact-item";
import { Event } from "../../const";

/**@import "./fact.scss" */
@Component("fact")
export class MdFact extends BaseComponent<{ title: string, lists: FactItemParams[] }>{
    onRendered(): void {
        
    }
    modify(){
        
        
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
