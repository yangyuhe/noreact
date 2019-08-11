import { BaseComponent } from "../../core/BaseComponent";
import { VNode } from "../../core/VNode";
import { TodoItem, TodoItemParams } from "./todo-item";
import React from "../../core/react";
export class TodoList extends BaseComponent<TodoListParams>{
    $Template(): VNode {
        return <div className="todo-list">
            {this.$params.todos.map((todo,index)=>{
                return <TodoItem text={todo.text} key={todo.id} onRemove={this.remove.bind(this)} index={index}></TodoItem>
            })}
        </div>;
    }
    remove(index:number){
        this.$params.todos.splice(index,1);
        this.$Refresh();
    }

}
export interface TodoListParams{
    todos:{text:string,id:number}[]
}