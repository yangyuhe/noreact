import { BaseComponent } from "../../core/BaseComponent";
import { VNode } from "../../core/VNode";
import { Component } from "../../core/component-manager";
import React from "../../core/react";
import { TeamItem, TeamItemParams } from "./team-item";
import { Title } from '../../common/title/title';
import {data1} from "./team-data";

/**@import "./team.scss" */
@Component("team")
export class TeamModule extends BaseComponent<TeamModuleParams>{
    constructor(params:TeamModuleParams){
        super(params);
        if(params.teamMemberAgents==null)
            this.params.teamMemberAgents=data1.teamMemberAgents;
    }
    onRendered(): void {
    }
    
    protected Render(): VNode {
        
        return (
            <div class="md-team">
                <Title title="operate team" ></Title>
                <div className="md-grid team-list">
                    <ul class="grid-list clearfix">
                        {this.params.teamMemberAgents.map(item=>{
                            return <TeamItem {...item}></TeamItem>;
                        })}
                    </ul>
                </div>
            </div>
        );
    }
}
export interface TeamModuleParams{
    teamMemberAgents:TeamItemParams[]
}