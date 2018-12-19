import { BaseComponent } from "../../core/BaseComponent";
import { VNode } from "../../core/VNode";
import React from "../../core/react";
import {Search} from "./search";
import {SearchResult} from "./search-result";
import {Detail} from "../card/card";

export class Listing extends BaseComponent<{data:Detail[]}>{
    onRendered(): void {
        
    }    
    private onSearch(key:string){
        let newitems:Detail[]=[{
            name:"名湖豪庭",
            price:333,
            opentime:new Date('1990-3-7')
        }];
        this.broadcast("refresh",newitems);
    }

    Render(): VNode {
        return (<div className="listing">
            <Search onSearch={this.onSearch.bind(this)}></Search>
            <SearchResult data={this.params.data}></SearchResult>
        </div>);
    }
}
