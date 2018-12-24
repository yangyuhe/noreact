import React from "../core/react";
import { VNode } from "../core/VNode";
import { BasePage } from "../core/BasePage";
import { User, UserData } from "../components/user/user";

export class UserPage extends BasePage<UserPageParams>{
    private title:string="用户v1";

    
    protected Render() :VNode{
        return (<html>
            <head>
                <title>{this.title}</title>
                <meta charset="utf8"/>
            </head>
            <body>
                {this.params.users.map(user=>{
                    <User {...user}></User>
                })}
            </body>
            <script>
                let __origin__={this.params};
                
            </script>
        </html>);
    }
    onRendered(): void {
        
    }
    
}
export interface UserPageParams{
    users:UserData[]
}