import { BasePage } from "../core/BasePage";
import { JSX } from "../core/VNode";
import { Component } from "../core/component-manager";

@Component("about-page")
export class AboutPage extends BasePage<{}>{
    onRendered(): void {
        throw new Error("Method not implemented.");
    }    
    protected Render(): JSX {
        
        throw new Error("Method not implemented.");
    }
}