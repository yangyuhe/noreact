import { BaseComponent } from "../core/BaseComponent";
import React from "../core/react";
import { VNode } from "../core/VNode";
import {Listing} from "../components/listing/listing";
import {Detail} from "../components/card/card";

export class HomePage extends BaseComponent<HomePageParams>{
    private title:string="首页";

    
    protected Render() :VNode{
        return (<html>
            <head>
                <title>{this.title}</title>
                <meta charset="utf8"/>
            </head>
            <body>
                <Listing data={this.params.listings}></Listing>
            </body>
            <script>
                let __origin__={this.params};
                
            </script>
            <script src="http://localhost:8003/homepage.js"></script>
        </html>);
    }
    onRendered(): void {
        
    }
    
}
export interface HomePageParams{
    listings:Detail[]
}