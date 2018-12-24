import { BaseComponent } from "../../core/BaseComponent";
import { VNode } from "../../core/VNode";
import React from "../../core/react";

/**@import "./user.scss" */
export class User extends BaseComponent<UserData>{
    onRendered(): void {
    }    
    protected Render(): VNode {
        return <div class="user">
            <h1>姓名:{this.params.name}</h1>
            <h1>年龄:{this.params.age}</h1>
        </div>;
    }

}
export interface UserData{
    name:string,
    age:number
}