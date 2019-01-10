import { BaseComponent } from "../../core/BaseComponent";
import { VNode } from "../../core/VNode";
import React from "../../core/react";
import {RatioImage, RatioImageParam} from "../../common/ratio-image/RatioImage";
import { Event } from "../../const";

export class Card extends BaseComponent<CardItemParams>{
    private static border="border";
    private static height="height";
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
    onRendered(): void {
        this.on(Event.CUSTOM_OVER,(target,data:{name:string,value:string}[])=>{
            data.forEach(item=>{
                if(item.name==Card.border){
                    this.$elem.css({border:item.value});
                    localStorage.setItem(Card.border,item.value);
                    return;
                }
                if(item.name==Card.height){
                    this.$elem.find(".house-status").css({height:item.value,'line-height':item.value});
                    localStorage.setItem(Card.height,item.value);
                    return;
                }
            });
        });
    }
    
    custom(){
        this.notify(Event.CUSTOM,[{
            name:Card.border,value:this.params.border
        },{
            name:Card.height,value:this.params.height
        }]);
    }
    protected Render(): VNode {
        return <div style={{border:this.params.border}} onClick={this.custom.bind(this)} className="card-item">
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
                </div>
            </div>
        </div>;
    }
}
export interface CardItemParams{
    detail: any,
    pic: string,
    border: string,
    height:string
}