import { BasePage } from "../core/BasePage";
import { VNode } from "../core/VNode";
import { Component } from "../core/component-manager";

@Component("about-page")
export class AboutPage extends BasePage<{}>{
    onRendered(): void {
        throw new Error("Method not implemented.");
    }    
    protected Render(): VNode {
        
        throw new Error("Method not implemented.");
    }
}