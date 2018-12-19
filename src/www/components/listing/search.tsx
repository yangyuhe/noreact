import { BaseComponent } from "../../core/BaseComponent";
import { VNode } from "../../core/VNode";
import React from "../../core/react";

export class Search extends BaseComponent<SearchParams>{
    onRendered(): void {
        
    }    
    onSearch(){
        if(this.params.onSearch){
            this.params.onSearch((this.$elem.find("input").val() as string));
        }
    }
    Render(): VNode {
        return <div>
            <input type="text"/>
            <button onClick={this.onSearch.bind(this)}>search</button>
        </div>
    }


}
export interface SearchParams{
    onSearch?:(key:string)=>void
}
