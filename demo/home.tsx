import { React, MVVM, VNode } from "../src";
import "./style.scss";

class TodoList extends MVVM<void>{
    private list: { id: number, content: string, time: string }[] = []
    private generate = 0;
    private showpop = false;
    private editTarget = null;
    protected Render(): VNode {
        return <div class="todolist">
            {this.list.map(item => <ToDoItem key={item.id} id={item.id} content={item.content} time={item.time}></ToDoItem>)}
            <button class="button add" onClick={this.add.bind(this)}>add</button>
            {this.showpop ? <div className="pop-mask"></div> : null}
            {this.showpop ? <div className="pop">
                <Add onAdd={this.onadd.bind(this)} editItem={this.editTarget}></Add>
            </div> : null}
        </div>
    }
    onRendered() {
        this.$on<number>("delete", id => {
            this.list = this.list.filter(item => item.id != id);
        });
        this.$on<number>("edit", id => {
            let item = this.list.find(item => item.id == id);
            this.editTarget = item;
            this.showpop = true;
        });
        this.$on<number>("move down", id => {
            let index = this.list.findIndex(item => item.id == id);
            if (index > -1 && index < this.list.length - 1) {
                [this.list[index], this.list[index + 1]] = [this.list[index + 1], this.list[index]];
            }
        });
        this.$on<number>("move up", id => {
            let index = this.list.findIndex(item => item.id == id);
            if (index > -1 && index > 0) {
                [this.list[index - 1], this.list[index]] = [this.list[index], this.list[index - 1]];
            }
        });
    }
    add() {
        this.showpop = true;
    }
    onadd(content: string, time: string, id: number) {
        if (id != null) {
            let item = this.list.find(item => item.id == id);
            item.content = content;
            item.time = time;
        } else {
            this.list = this.list.concat([{
                id: this.generate++,
                content: content,
                time: time
            }]);
        }

        this.showpop = false;
    }

}
class ToDoItem extends MVVM<{ id: number, content: string, time: string }>{
    protected Render(): VNode {
        return <div className="todo-item">
            <div className="todo-content">
                <div className="todo-time">{this.$props.time}</div>
                <div className="todo-des">{this.$props.content}</div>
                <input type="text" />
            </div>
            <div className="operations">
                <button className="oper up" onClick={this.doAction.bind(this, 'move up')}>up</button>
                <button className="oper down" onClick={this.doAction.bind(this, 'move down')}>down</button>
                <button className="oper edit" onClick={this.doAction.bind(this, 'edit')}>edit</button>
                <button onClick={this.doAction.bind(this, 'delete')} className="oper delete">delete</button>
            </div>
        </div>
    }
    doAction(action: string) {
        this.$emitUp(action, this.$props.id);
    }
}
interface ITodoItem {
    id: number,
    content: string,
    time: string
}
class Add extends MVVM<{ onAdd: (content: string, time: string, id: number) => void, editItem: ITodoItem }>{
    cotent: string = "";
    time: string = "";
    constructor($props: { onAdd: (content: string, time: string) => void, editItem: ITodoItem }) {
        super($props);
        if (this.$props.editItem) {
            this.cotent = this.$props.editItem.content;
            this.time = this.$props.editItem.time;
        }

    }
    protected Render(): VNode {
        return <div className="add-todo">
            content:
            <input value={this.cotent} onChange={this.onchange.bind(this, 'cotent')}></input>
            <input type="date" value={this.time} onChange={this.onchange.bind(this, 'time')} />
            <button onClick={this.onadd.bind(this)}>ok</button>
        </div>
    }
    onadd() {
        this.$props.onAdd(this.cotent, this.time, this.$props.editItem == null ? null : this.$props.editItem.id);
        this.cotent = '';
        this.time = '';
    }
    onchange(field, event) {
        this[field] = event.target.value;
    }
}
document.addEventListener("DOMContentLoaded", () => {
    let about = new TodoList();
    (window as any).noreact = about;
    let dom = about.$ToDom();
    document.body.append(dom[0]);
    about.$onRendered();
});