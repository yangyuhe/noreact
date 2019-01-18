import { ToDoV2 } from "../components/todo/todo-v2";
import { BaseComponent } from "../core/BaseComponent";
import React from "../core/react";
import { VNode } from "../core/VNode";
import { ToDoV1 } from "../components/todo/todo-v1";

export class AboutPage extends BaseComponent<{}>{
    private todos:{text:string,id:number}[]=[];
    protected Render(): VNode {
        return <ToDoV1 todos={this.todos}></ToDoV1>;
    }
}