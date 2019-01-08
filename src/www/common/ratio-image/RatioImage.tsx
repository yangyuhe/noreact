import { BaseComponent } from "../../core/BaseComponent";
import React from "../../core/react";
import { VNode } from "../../core/VNode";

/**@import "./ratio-image.scss" */

export class RatioImage extends BaseComponent<RatioImageParam>{
    
    onRendered(): void {
        let img=document.createElement("img");
        img.src=this.params.picUrl;
        img.onload=()=>{
            let imgH=img.naturalHeight;
            let imgW=img.naturalWidth;
            let containerW=this.$elem.width();
            let containerH=this.$elem.height();
            if(containerH/imgH > containerW/imgW){
                img.style.height="100%";
            }else{
                img.style.width="100%";
            }
        };
        this.$elem.find(".ratio-image-inner").append(img);
    }    
    protected Render(): VNode {
        return <div className="ratio-image">
            <div className="ratio-image-inner" style={"padding-top:"+this.params.ratio*100+"%;" + (this.params.border ? ("border:" + this.params.border) : "")}></div>
        </div>;
    }
}
export interface RatioImageParam{
    ratio:number,
    picUrl:string,
    border?:string
}
