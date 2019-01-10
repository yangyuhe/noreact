import { BasePage } from "../core/BasePage";
import { VNode } from "../core/VNode";
import { Component } from "../core/component-manager";
import { Header, Menu, HeaderParam } from "../common/header/Header";
import React from "../core/react";
import { CardList } from "../components/card/card-list";
import { CardItemParams } from "../components/card/card";
import { TeamModule, TeamModuleParams } from "../components/team/team";
/**@import "../assets/css/common.scss"; */
import { Edit } from "../components/edit/edit";
@Component("about-page")
export class AboutPage extends BasePage<AboutPageParams>{
    constructor(params: AboutPageParams) {
        super(params);
    }
    onRendered(): void {
    }
    protected Render(): VNode {
        return <div>
            <Header {...this.params.header}></Header>
            <CardList cards={this.params.cards}></CardList>
            <TeamModule {...this.params.teams}></TeamModule>
            <Edit></Edit>
        </div>
    }
}
export interface AboutPageParams {
    header:HeaderParam,
    cards?: CardItemParams[],
    teams?: TeamModuleParams
}