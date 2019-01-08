import { BaseComponent } from "../../core/BaseComponent";
import { VNode } from "../../core/VNode";
import React from "../../core/react";
import {RatioImage, RatioImageParam} from "../../common/ratio-image/RatioImage";

export class CardItem extends BaseComponent<CardItemParams>{
    private intervalId=null;
    onRendered(): void {
        // this.intervalId=setInterval(() => {
        //     console.log(this.params.des);
        // }, 1000);
    }
    constructor(params:CardItemParams){
        super(params);
        this.on("remove",(p1,p2)=>{
            console.log("p1:"+p1,"p2"+p2);
            if(this.intervalId)
                clearInterval(this.intervalId);
            this.$elem.remove();
        });
    }
    test(){
        
    }  
    protected Render(): VNode {
        return <div onMouseOver={this.test.bind(this)} className="card-item">
            <RatioImage  picUrl={this.params.pic} border={this.params.border}  ratio={0}></RatioImage>
            <div class="mask">
                <div class="house-detail"> 
                    <p class="house-status house-sold-date">SOLD at <span data-adjust-time="1544616865000">{this.params.detail['date']}</span></p> 
                    <p class="sold-flag">SOLD</p> 
                    <div class="initial-price"> 
                        <p class="house-initial-price">{this.params.detail['initial-price']}</p> 
                        <span class="house-trend mg-trend-up">{this.params.detail['trend-up']}</span> 
                    </div> 
                    <p class="house-price">{this.params.detail['house-price']}</p> 
                </div>
            </div>
        </div>;
    }
}
export interface CardItemParams{
    detail: any,
    pic: string,
    border: string
}