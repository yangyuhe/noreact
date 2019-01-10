import { BaseComponent } from "../../core/BaseComponent";
import { VNode } from "../../core/VNode";
import { Component } from "../../core/component-manager";
import React from "../../core/react";
import { SearchItem, SearchItemParams } from "./search-item";
import { Title } from '../../common/title/title';

/**@import "./search.scss" */
@Component("search")
export class SearchModule extends BaseComponent<SearchItemParams[]>{
    
    onRendered(): void {
    }    
    protected Render(): VNode {
        
        return (
            <div class="md-quick-search">
                <Title title="quick search"></Title>
                <div className="list">
                    <ul class="quick-list clearfix">
                        {this.params.map(item=>{
                            return <SearchItem {...item}></SearchItem>;
                        })}
                    </ul>
                </div>
            </div>
        );
    }
}