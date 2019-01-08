import { BaseComponent } from "../../core/BaseComponent";
import { VNode } from "../../core/VNode";
import React from "../../core/react";

/**@import "./gallary.scss" */
export class Gallery extends BaseComponent<{}>{
    onRendered(): void {
        throw new Error("Method not implemented.");
    }    
    protected Render(): VNode {
        return <div className="gallery">
        </div>;
    }
}