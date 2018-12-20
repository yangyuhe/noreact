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
        let url="ws://localhost:8002";
        const connection=new WebSocket(url);
        connection.onopen=()=>{
            console.log("client ok");
        };
        connection.onerror=error=>{
            console.error(error)
        };
        connection.onmessage=(event)=>{
            let cssChange=JSON.parse(event.data);
            switch(cssChange.type){
                case "delete":
                    let delStyle=document.getElementById(cssChange.name);
                    if(delStyle){
                        delStyle.remove();
                    }
                    break;
                case "add":
                    let addStyle=document.createElement("style");
                    addStyle.setAttribute("id",cssChange.name);
                    addStyle.innerText=cssChange.css;
                    document.head.appendChild(addStyle);
                    break;
                case "change":
                    let changeStyle=document.getElementById(cssChange.name);
                    if(changeStyle){
                        changeStyle.innerText=cssChange.css;
                    }
                    break;
                default:
                    throw new Error("未知的消息"+cssChange);
            }
        };
    }
    
}
export interface HomePageParams{
    listings:Detail[]
}