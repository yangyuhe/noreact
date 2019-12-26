import { React,MVVM,VNode } from "../www/core";
import "./style.scss";
class TodoList extends MVVM<void>{
    private list:{id:number,content:string}[]=[]
    private generate=0;
    private showpop=false;
    protected Render(): VNode {
        return <div class="todolist">
            {this.list.map(item=><span>{item.content}</span>)}
            <button onClick={this.add.bind(this)}>add</button>
            {this.showpop?<div className="pop-mask"></div>:null}
            {this.showpop?<div className="pop">
                <Add onAdd={this.onadd.bind(this)}></Add>
            </div>:null}
            </div>
    }
    add(){
        this.showpop=true;
    }
    onadd(content:string){
        this.list=this.list.concat([{
            id:this.generate++,
            content:content
        }]);
    }
    
}
class Add extends MVVM<{onAdd:Function}>{
    protected Render(): VNode {
        return <div className="add-todo">
            content:<input type="text"/>
            <button onClick={this.$params.onAdd.bind(null,'world')}>ok</button>
        </div>
    }
}
document.addEventListener("DOMContentLoaded",()=>{
    let about=new TodoList();
    (window as any).noreact=about;
    let dom=about.$ToDom();
    document.body.append(dom[0]);
    about.onRendered();
});