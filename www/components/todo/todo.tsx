//这是组件的逻辑层
import { BaseComponent } from "../../core/BaseComponent";
export abstract class ToDo extends BaseComponent<{todos:{text:string,id:number}[]}>{
    private counter=0;
    protected todos:{text:string,id:number}[]=this.$params.todos;
    add(text:string){
        this.todos.push({id:(new Date()).getTime(),text:String.fromCharCode(this.counter+65)});
        this.counter++;
        this.$Refresh();

        console.log(this.todos)
    }
}