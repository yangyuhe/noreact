import React from "../../core/react";
import { VNode } from "../../core/VNode";
import { ToDo } from "./ToDo";
import { TodoList } from "./todo-list";
import { ToDoV1 } from "./todo-v1";
export class ToDoV2 extends ToDoV1{
    h2(){
        return <h5>xx</h5>
    }
}