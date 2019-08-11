import { BaseComponent } from "./core/BaseComponent";
import { VNODE_ID } from "./core/attribute";
import { VNode } from "./core/VNode";
import { GetJSModule } from "./dynamic-require";

declare let $noreact_roots:{name:string,data:any}[];
if($noreact_roots){
    let promises:Promise<any>[]=[];
    $noreact_roots.forEach(root=>{
        let promise=GetJSModule(root.name);
        if(promise){
            promise.then(module=>{
                let component:BaseComponent<any>=new module(root.data);
                let tree=component.$GetRoot();
                let nodeId=tree.GetAttr(VNODE_ID);
                let selector=`[${VNODE_ID}='${nodeId}']`;
                let dom=document.querySelector(selector) as HTMLElement;
                
                RestoreVNode(tree,dom);
                tree.Rendered();
            });
            promises.push(promise);
        }
    });
}

function RestoreVNode(vnode:VNode,elem:HTMLElement){
    vnode.AttachDom(elem);
    let childrenVnodes=vnode.GetChildren();
    let childrenDoms=elem.childNodes;
    
    let domHash:{[id:string]:HTMLElement}={};
    let texts:Text[]=[];
    childrenDoms.forEach(child=>{
        if(child instanceof HTMLElement){
            let id=child.getAttribute(VNODE_ID);
            if(id)
                domHash[id]=child;
            return;
        }
        if(child instanceof Text){
            texts.push(child);
            return;
        }
    });
    childrenVnodes.forEach(child=>{
        if(child.GetType()=="element"){
            let id=child.GetAttr(VNODE_ID);
            let dom=domHash[id];
            if(dom){
                RestoreVNode(child,dom);
            }else{
                console.error("bootstrap:can not find dom of vnode");
            }
            return;
        }
        if(child.GetType()=="text"){
            let text=texts.pop();
            if(text){
                child.AttachDom(text);
            }
            return;
        }
    });
}


