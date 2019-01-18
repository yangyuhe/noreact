import { BaseComponent } from "../../core/BaseComponent";
import { VNode } from "../../core/VNode";
import React from "../../core/react";

/**@import "./todo-item.scss" */
export class TodoItem extends BaseComponent<TodoItemParams>{
    private index:number=-1;
    constructor(params:TodoItemParams){
        super(params);
        this.index=params.index;
    }
    private remove(){
        this.params.onRemove(this.params.index);
    }
    protected Render(): VNode {
        return <div className="todo-item">
            <span className="index">{this.index+1}:</span>
            <span className="content">{this.params.text}</span>
            <button onClick={this.remove.bind(this)}>remove</button>
        </div>;
    }
}
export interface TodoItemParams{
    text:string,
    index:number,
    key?:number,
    onRemove:(index:number)=>void
}