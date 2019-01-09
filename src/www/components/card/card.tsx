import { BaseComponent } from "../../core/BaseComponent";
import { VNode } from "../../core/VNode";
import { Component } from "../../core/component-manager";
import React from "../../core/react";
import { CardItem, CardItemParams } from "./card-item";
import axios from "axios";

/**@import "./card.scss" */
@Component("card")
export class Card extends BaseComponent<CardItemParams[]>{
    onRendered(): void {
        console.log("hello")
    }
    modify() {
        this.notify("modify",[{
            name:"border",
            type:"input",
            value: "3px solid red"
        }],(data:{name:string,value:string}[])=>{
            this.params.forEach((item)=>{
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
        // debugger;
        return (<div className="card-list">

            {this.params.map(item=>{
                return <CardItem {...item}></CardItem>;
            })}
            <button style="margin-top: 20px;" onClick={this.modify.bind(this)}>修改</button>
        </div>);
    }
}