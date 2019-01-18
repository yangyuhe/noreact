import { BaseComponent } from "../../core/BaseComponent";
export abstract class ToDo extends BaseComponent<{todos:{text:string,id:number}[]}>{
    private counter=0;
    add(text:string){
        this.params.todos.push({id:this.counter,text:String.fromCharCode(this.counter+65)});
        this.counter++;
        this.Refresh();
    }
}