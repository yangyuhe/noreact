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
    constructor(params:CardsParam){
        super(params);
        if(params.cards==null){
            this.params.cards=data1.cards;
        }
    }
    onRendered(): void {
        console.log("hello")
    }
    modify() {
        this.notify("modify",[{
            name:"border",
            type:"input",
            value: "3px solid red"
        }],(data:{name:string,value:string}[])=>{
            this.params.cards.forEach((item)=>{
                item.border = data[0].value;
                
            });
            this.$elem.find(".ratio-image-inner").css("border", data[0].value);
            axios.post("/save",{
                name:this.Name,
                data:this.params
            })
        });
    }
    protected Render(): VNode {
        return (<div className="card-list">

            {this.params.cards.map(item=>{
                return <Card {...item}></Card>;
            })}
        </div>);
    }
}
export interface CardsParam{
    cards:CardItemParams[]
}