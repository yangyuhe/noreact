import React from "../../core/react";
import { VNode } from "../../core/VNode";
import { ToDo } from "./ToDo";
import { TodoList } from "./todo-list";
export class ToDoV1 extends ToDo{
    protected Render(): VNode {
        return <div className="todo">
            <h4>Todo List V1</h4>
            <TodoList todos={this.params.todos}></TodoList>
            <button onClick={this.add.bind(this)}>add</button>
        </div>;
    }
}