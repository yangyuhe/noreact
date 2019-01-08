import { BaseComponent } from "../../core/BaseComponent";
import { VNode } from "../../core/VNode";
import React from "../../core/react";
import {RatioImage} from "../../common/ratio-image/RatioImage";

export class FactItem extends BaseComponent<FactItemParams>{
    onRendered(): void {
    
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