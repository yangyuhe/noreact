import { BaseComponent } from "../../core/BaseComponent";
import { VNode } from "../../core/VNode";
import React from "../../core/react";
import { Event } from "../../const";
import { TeamModule } from "./team";

export class TeamItem extends BaseComponent<TeamItemParams>{
    private static margin="margin";
    onRendered(): void {
        this.on(Event.CUSTOM_OVER,(target,data:{name:string,value:string}[])=>{
            data.forEach(item=>{
                if(item.name==TeamItem.margin){
                    this.$elem.css({margin:`0px ${item.value}`});
                    localStorage.setItem(TeamItem.margin,item.value);
                    return;
                }
            });
        });
    }
    constructor(params:TeamItemParams){
        super(params);
        if(typeof(localStorage)!='undefined'){
            let cache=localStorage.getItem(TeamItem.margin);
            if(cache)
                this.params.margin=cache;
        }
        
    }
    custom(){
        this.notify(Event.CUSTOM,[{
            name:TeamItem.margin,value:this.params.margin
        }]);
    }
    protected Render(): VNode {
        const { image, fullName, position, licenseName, license, detailUrl } = this.params;
        return (
            <li onClick={this.custom.bind(this)} style={{'margin':`0px ${this.params.margin}`}} class="grid-item">
                <a href="javascript:void(0);">
                    <div class="grid-team">
                        <img src={image}/>
                        <div class="grid-information">
                            <p class="username">{fullName}</p>
                            <p>
                                <span class="position">
                                    {position}
                                </span>
                                <span class="license">
                                    {licenseName} {license}
                                </span>
                            </p>
                        </div>
                    </div>
                    <div class="grid-username">{fullName}</div>
                </a> 
            </li>
        )
    }
}
export interface TeamItemParams{
    image:string,
    fullName:string,
    position:string,
    licenseName:string,
    license:string,
    detailUrl:string,
    margin:string
}