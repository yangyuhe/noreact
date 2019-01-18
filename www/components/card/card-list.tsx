import { BaseComponent } from "../../core/BaseComponent";
import { VNode } from "../../core/VNode";
import { Component } from "../../core/component-manager";
import React from "../../core/react";
import { Card as Card, CardItemParams } from "./card";
import axios from "axios";
import {data1} from "./card-data";

/**@import "./card-list.scss" */
@Component("card")
export class CardList extends BaseComponent<CardsParam>{
    private static border="border";
    private show=false;
    private temp:CardItemParams=null;
    constructor(params:CardsParam){
        super(params);
        if(params.cards==null){
            this.params.cards=data1.cards;
        }
    }
    onRendered(): void {
        console.log("hello")
    }
    
    protected Render(): VNode {
        return (<div className="card-list">
            {this.show?<Card {...this.temp}></Card>:null}
            {this.params.cards.map(item=>{
                return <Card {...item}></Card>;
            })}
        </div>);
    }
}
export interface CardsParam{
    cards:CardItemParams[]
}