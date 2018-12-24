import React from "../core/react";
import { VNode } from "../core/VNode";
import {Listing} from "../components/listing/listing";
import {Detail} from "../components/card/card";
import { BasePage } from "../core/BasePage";

export class HomePage extends BasePage<HomePageParams>{
    private title:string="首页v1 ";
    
    protected Render() :VNode{
        return (<html>
            <head>
                <title>{this.title}</title>
                <meta charset="utf8"/>
            </head>
            <body>
                <Listing data={this.params.listings}></Listing>
            </body>
        </html>);
    }
    onRendered(): void {
    }
    
}
export interface HomePageParams{
    listings:Detail[]
}