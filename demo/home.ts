import {ToDoV1} from "../www/components/todo/todo-v1";
document.addEventListener("DOMContentLoaded",()=>{
    let about=new ToDoV1({todos:[]});
    let dom=about.$ToDom();
    document.body.append(dom[0]);
    about.onRendered();
});