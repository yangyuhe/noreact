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
        this.on(Event.CUSTOM, (target, data: { name: string, type: string, value: string }[]) => {
            this.$elem.css({transform:"translateY(0)"});
            this.clear();
            let input: VNode[] = data.map(item => {
                return (
                    <div className="field-item">
                        <div className="field-title">{item.name}</div>
                        <input className="field-input" type={item.type} name={item.name} value={item.value} />
                    </div>);
            });
            input.forEach(item => {
                let $dom = $(item.ToDom());
                this.$elem.find(".edit-list").append($dom);
            });
        });
    }
    clear() {
        this.$elem.find('.edit-list').empty();
    }
    onSave() {
        let data: { name: string, value: string }[] = [];
        let fields = this.$elem.find(".field-item");
        for (let i = 0; i < fields.length; i++) {
            let name = $(fields[i]).find(".field-title").text();
            let value: any = $(fields[i]).find(".field-input").val();
            data.push({ name: name, value: value });
        }

        this.notify(Event.CUSTOM_OVER,data);
    }
    onCancel() {
        this.$elem.css({ transform: "translateY(100%)" });
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