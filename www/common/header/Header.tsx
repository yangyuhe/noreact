import { BaseComponent } from "../../core/BaseComponent";
import { VNode } from "../../core/VNode";
import React from "../../core/react";
import { Component } from "../../core/component-manager";
import {MoreMenu} from "./MoreMenu";
import {data1} from "./header-data";
import { Event } from "../../const";
/**@import "./header.scss" */
@Component("header")
export class Header extends BaseComponent<HeaderParam>{
    private static indicatorColor="indicator color";
    private static textColor="text color";
    constructor(params:HeaderParam){
        super(params);
        if(params.menus==null){
            this.params.menus=data1.menus;
        }
        if(params.indicatorColor==null && typeof(localStorage)!='undefined'){
            let cache=localStorage.getItem(Header.indicatorColor);
            if(cache)
                params.indicatorColor=cache;
            else
                params.indicatorColor=data1.indicatorColor;
        }
        if(params.textcolor==null  && typeof(localStorage)!='undefined'){
            let cache=localStorage.getItem(Header.textColor);
            if(cache)
                params.textcolor=cache;
            else
                params.textcolor=data1.textcolor;
        }
    }
    onRendered(): void {
        this.on(Event.CUSTOM_OVER,(target,data:{name:string,value:string}[])=>{
            data.forEach(item=>{
                if(item.name==Header.indicatorColor){
                    this.$elem.find(".indicator").css({"background-color":item.value});
                    localStorage.setItem(Header.indicatorColor,item.value);
                    return;
                }
                if(item.name==Header.textColor){
                    this.$elem.find(".menu").css({color:item.value});
                    localStorage.setItem(Header.textColor,item.value);
                    return;
                }
            });
        });
    }    
    custom(){
        this.notify(Event.CUSTOM,[
            {name:Header.indicatorColor,value:this.params.indicatorColor},
            {name:Header.textColor,value:this.params.textcolor}
        ]);
    }
    
    protected Render(): VNode {
        return <div onClick={this.custom.bind(this)} className="header">
            {this.params.menus.map(menu=>{
                return <div style={{color:this.params.textcolor}} className="menu">
                    {menu.name}
                    <span style={{'background-color':this.params.indicatorColor}} className="indicator"></span>
                </div>;
            })}
            <MoreMenu></MoreMenu>
        </div>;
    }
}
export interface HeaderParam{
    menus:Menu[],
    indicatorColor:string,
    textcolor:string
}
export interface Menu{
    name:string,
    children:Menu[]
}