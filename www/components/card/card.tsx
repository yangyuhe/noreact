import { BaseComponent } from "../../core/BaseComponent";
import { VNode } from "../../core/VNode";
import React from "../../core/react";
import {RatioImage, RatioImageParam} from "../../common/ratio-image/RatioImage";
import { Event } from "../../const";

/**@import "./card.scss" */
export class Card extends BaseComponent<CardItemParams>{
    private static border="border";
    private static height="height";
    private counter=0;
    constructor(params:CardItemParams){
        super(params);
        if(typeof(localStorage)!='undefined'){
            let cache=localStorage.getItem(Card.border);
            if(cache)
                this.params.border=cache;
            cache=localStorage.getItem(Card.height);
            if(cache)
                this.params.height=cache;
        }
        
    }
    onRendered(){
        console.log("hello")
        window.setInterval(()=>{
            console.log(this.counter);
            this.counter++;
            this.Refresh();
        },1000);
    }
    
    
    protected Render(): VNode {
        return <div key={this.params.key} style={{border:this.params.border}} className="card-item">
            <RatioImage  picUrl={this.params.pic} border={this.params.border}  ratio={2}></RatioImage>
            <div class="mask">
                <div class="house-detail"> 
                    <p style={{height:this.params.height,'line-height':this.params.height}} class="house-status house-sold-date">SOLD at <span data-adjust-time="1544616865000">{this.params.detail['date']}</span></p> 
                    <p class="sold-flag">SOLD</p> 
                    <div class="initial-price"> 
                        <p class="house-initial-price">{this.params.detail['initial-price']}</p> 
                        <span class="house-trend mg-trend-up">{this.params.detail['trend-up']}</span> 
                    </div> 
                    <p class="house-price">{this.params.detail['house-price']}</p> 
                    <p style="color:red">{this.counter}</p>
                    
                </div>
            </div>
        </div>;
    }
}
export interface CardItemParams{
    id:string,
    detail: any,
    pic: string,
    border: string,
    height:string,
    key?:string
}