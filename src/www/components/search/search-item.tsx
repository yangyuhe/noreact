import { BaseComponent } from "../../core/BaseComponent";
import { VNode } from "../../core/VNode";
import React from "../../core/react";

export class SearchItem extends BaseComponent<SearchItemParams>{
    onRendered(): void {
    }
    constructor(params:SearchItemParams){
        super(params);
    }
    protected Render(): VNode {
        const { searchTitle, counts } = this.params;
        return (
            <li>
                <a href="/search/quick/${list.searchLabel}" title={searchTitle}>
                    <span class="search-title">{searchTitle}</span>
                    <span class="hot-house">HOT</span>
                    <span class="num" data-format="number">{counts}</span>
                </a>
            </li>
        )
    }
}
export interface SearchItemParams{
    searchTitle:string,
    counts:string
}