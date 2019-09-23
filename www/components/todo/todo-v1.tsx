//这是组件的视图层，通过继承逻辑层扩展自己的视图结构
import React from "../../core/react";
import { VNode } from "../../core/VNode";
import { ToDo } from "./ToDo";
import { TodoList } from "./todo-list";
/**@import "./todo.scss" */
/**@component() */
export class ToDoV1 extends ToDo{
    h2(){
        return <h4>Todo List V1</h4>
    }
    Render(): VNode {
        return <div className="todo">
            {this.h2()}
            <TodoList todos={this.todos}></TodoList>
            <button onClick={this.add.bind(this)}>add</button>
        </div>;
    }
}