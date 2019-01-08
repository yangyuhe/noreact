import { BaseComponent } from "../../core/BaseComponent";
import { VNode } from "../../core/VNode";
import React from "../../core/react";
import {RatioImage} from "../../common/ratio-image/RatioImage";

export class FactItem extends BaseComponent<FactItemParams>{
    private intervalId=null;
    onRendered(): void {
        this.intervalId=setInterval(() => {
            console.log(this.params.des);
        }, 1000);
    }
    constructor(params:FactItemParams){
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
        return <div onClick={this.test.bind(this)} className="fact-item">
            <RatioImage ratio={0.3} picUrl={this.params.pic}></RatioImage>
            <div className="des">{this.params.des}</div>
        </div>;
    }
}
export interface FactItemParams{
    pic:string,
    des:string
}