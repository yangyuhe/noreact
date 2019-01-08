import { BaseComponent } from "../../core/BaseComponent";
import { VNode } from "../../core/VNode";
import React from "../../core/react";
import { Component } from "../../core/component-manager";
import {MoreMenu} from "./MoreMenu";
/**@import "./header.scss" */
@Component("header")
export class Header extends BaseComponent<Menu[]>{
    onRendered(): void {
        
        window.addEventListener("resize",()=>{
            console.log("xx")
        });
    }    
    resizeMenu(){
        
        
    }
    bg(){
        let bg=localStorage.getItem("header-bg");
    }
    protected Render(): VNode {
        return <div className="header">
            {this.params.map(menu=>{
                return <div className="menu">
                    {menu.name}
                    <span className="indicator"></span>
                </div>;
            })}
            <MoreMenu></MoreMenu>
        </div>;
    }
}

interface Menu{
    name:string,
    children:Menu[]
}