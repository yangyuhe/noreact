import { BaseComponent } from "../../core/BaseComponent";
import { VNode } from "../../core/VNode";
import React from "../../core/react";

export class TeamItem extends BaseComponent<TeamItemParams>{
    onRendered(): void {
    }
    constructor(params:TeamItemParams){
        super(params);
    }
    protected Render(): VNode {
        const { image, fullName, position, licenseName, license, detailUrl } = this.params;
        return (
            <li class="grid-item">
                <a href={detailUrl}>
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
    detailUrl:string
}