import { BaseComponent } from "../../core/BaseComponent";
import { VNode } from "../../core/VNode";
import React from "../../core/react";

/**@import "./title.scss" */
export class Title extends BaseComponent<TitleParams>{
    onRendered(): void {
    }
    constructor(params:TitleParams){
        super(params);
    }
    test(){
        
    }
    protected Render(): VNode {
        const { title } = this.params;
        return (
            <p class="mg-title" onClick={this.test.bind(this)}>{title || 'hello world'}</p>
        )
    }
}
export interface TitleParams{
    title:string
}