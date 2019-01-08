import { BaseComponent } from "../../core/BaseComponent";
import { VNode } from "../../core/VNode";
import React from "../../core/react";
import {RatioImage} from "../../common/ratio-image/RatioImage";
import { Span } from "../../common/span/span";

export class FactItem extends BaseComponent<FactItemParams>{
    private intervalId=null;
    onRendered(): void {
    }
    constructor(params:FactItemParams){
        super(params);
        
    }
    
    protected Render(): VNode {
        return <div  className="fact-item">
            <RatioImage ratio={0.3} picUrl={this.params.pic}></RatioImage>
            <div className="des">{this.params.des}</div>
            <Span>hello</Span>
        </div>;
    }
}
export interface FactItemParams{
    pic:string,
    des:string
}