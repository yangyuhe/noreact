import { BaseComponent } from "./BaseComponent";

let roots:BaseComponent<any>[]=[];

export function Refresh(){
    roots.forEach(root=>{
        root.__refresh();
    });
}