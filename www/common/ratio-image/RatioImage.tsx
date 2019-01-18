import { BaseComponent } from "../../core/BaseComponent";
import React from "../../core/react";
import { VNode } from "../../core/VNode";
import { debug } from "util";

/**@import "./ratio-image.scss" */

export class RatioImage extends BaseComponent<RatioImageParam>{
    
    onRendered(): void {
        let img=document.createElement("img");
        img.src=this.params.picUrl;
        img.onload=()=>{
            let imgH=img.naturalHeight;
            let imgW=img.naturalWidth;
            
        };
    }    
    protected Render(): VNode {
        return <div className="ratio-image">
            <div className="ratio-image-inner"></div>
        </div>;
    }
}
export interface RatioImageParam{
    ratio:number,
    picUrl:string,
    border?:string
}
