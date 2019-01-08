import { BaseComponent } from "../../core/BaseComponent";
import { VNode } from "../../core/VNode";
import { Component } from "../../core/component-manager";
import React from "../../core/react";
import { TeamItem, TeamItemParams } from "./team-item";
import { Title } from '../../common/title/title';

/**@import "./team.scss" */
@Component("team")
export class TeamModule extends BaseComponent<TeamModuleParams>{
    
    onRendered(): void {
        console.log("team module")
    }    
    protected Render(): VNode {
        
        return (
            <div>
                <Title title="operate team"></Title>
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
interface TeamModuleParams{
    teamMemberAgents:TeamItemParams[]
}