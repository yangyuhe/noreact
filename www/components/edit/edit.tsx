import { BaseComponent } from "../../core/BaseComponent";
import { VNode } from "../../core/VNode";
import React from "../../core/react";
import axios from "axios";
import { Component } from "../../core/component-manager";
import $ from "jquery";
import { Event } from "../../const";

/**@import "./edit.scss" */
@Component("edit")
export class Edit extends BaseComponent<{}>{
    onRendered(): void {
        
    }
    clear() {
    }
    onSave() {
        
    }
    onCancel() {
    }
    protected Render(): VNode {
        return <div class="edit">
            <div className="edit-list"></div>
            <div className="oper">
                <button className="save-btn" onClick={this.onSave.bind(this)}>保存</button>
                <button className="cancel-btn" onClick={this.onCancel.bind(this)}>取消</button>
            </div>
        </div>
    }
}