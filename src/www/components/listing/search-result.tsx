import { BaseComponent } from "../../core/BaseComponent";
import { VNode } from "../../core/VNode";
import React from "../../core/react";
import {Card,Detail} from "../card/card";
export class SearchResult extends BaseComponent<{data:Detail[]}>{
    onRendered(): void {
        this.on("refresh",(data:Detail[])=>{
            this.params.data=data;
            let lists:VNode[]=this.params.data.map(item=>(
                <Card onClick={this.onCardClick.bind(this)} data={item}></Card>
            ));
            this.$elem.empty();
            lists.forEach(item=>{
                this.$elem.append(item.ToDom());
            });

        });
        
    }    
    onCardClick(info:Detail){
        alert(info.name+" click");
    }
    Render(): VNode {
        return (
            <div className="listing-result">
                {this.params.data.map(item=>(
                    <Card onClick={this.onCardClick.bind(this)} data={item}></Card>
                ))}
            </div>
        );
    }
}
