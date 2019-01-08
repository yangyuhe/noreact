import { BaseComponent } from "../../core/BaseComponent";
import { VNode } from "../../core/VNode";
import React from "../../core/react";
import {RatioImage} from "../../common/ratio-image/RatioImage";

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
        alert("hello")
    }  
    protected Render(): VNode {
        return <div onClick={this.test.bind(this)} className="card-item">
            <RatioImage ratio={0.3} picUrl={this.params.pic}></RatioImage>
            <div class="house-detail"> 
                <p class="house-status house-sold-date">SOLD at <span data-adjust-time="1544616865000">12/12/2018</span></p> 
                <p class="sold-flag">SOLD</p> 
                <div class="initial-price"> 
                    <p class="house-initial-price">$7,665,000</p> 
                    <span class="house-trend mg-trend-up">4%</span> 
                </div> 
                <p class="house-price">$8,000,000</p> 
            </div>
        </div>;
    }
}
export interface CardItemParams{
    pic:string,
    des:string
}