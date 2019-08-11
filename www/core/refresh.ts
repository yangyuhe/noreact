import { BaseComponent } from "./BaseComponent";

let queue:BaseComponent<any>[]=[];

let promise:Promise<void>;
export function PreRefresh(mvvm:BaseComponent<any>){
    if(queue.indexOf(mvvm)==-1){
        queue.push(mvvm);
    }
    if(!promise){
        promise=new Promise((resolve,reject)=>{
            resolve();
        }).then(()=>{
            Refresh();
            queue=[];
            promise=null;
        });
    }
}
function Refresh(){
    let roots:BaseComponent<any>[]=[];
    queue.forEach(item=>{
        let vnode=item.$GetRoot();
        
        while(vnode.GetParent()){
            vnode=vnode.GetParent();
            if(vnode.GetInstance()){
                item=vnode.GetInstance();
            }
        }
        if(roots.indexOf(item)==-1){
            roots.push(item);
        }
    });
    roots.forEach(root=>{
        root.$ApplyRefresh();
    });
}