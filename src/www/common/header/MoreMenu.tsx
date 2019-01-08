import { BaseComponent } from "../../core/BaseComponent";
import { VNode } from "../../core/VNode";
import React from "../../core/react";


export class MoreMenu extends BaseComponent<{}>{
    onRendered(): void {
        window.addEventListener("resize",()=>{
            console.log("bb")
        });
    }    
    protected Render(): VNode {
        return <div className="more-menu">
        &#xe927;
        </div>;
    }
}