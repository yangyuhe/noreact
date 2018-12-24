import { NO_RENDERED_ATTRS, VNODE_ID } from "../core/const";
import { VNode } from "../core/VNode";
import { BasePage } from "../core/BasePage";

declare let $noreact_root:string;
declare let $noreact_data:any;
if($noreact_root && $noreact_data){
    let promise:Promise<any>;
    if($noreact_root=="HomePage"){
        promise=import(/*webpackChunkName:"homepage" */"./HomeV1").then(module=>{
            return module.HomePage;
        });
    }
    if(promise)
        promise.then(module=>{
            let root:BasePage<any>=new module($noreact_data);
            let tree=root.GetVNode();
            tree.SetObj(root);
            RestoreVNode(tree);
        });
}

let ws=new WebSocket("ws://localhost:8002/noreact-tool");
ws.onmessage=msg=>{
    if(msg.data=="refresh"){
        window.location.reload();
    }
};

function RestoreVNode(vnode:VNode){
    let nodeId=vnode.GetAttr(VNODE_ID);
    let selector=`[${VNODE_ID}='${nodeId}']`;
    let dom=document.querySelector(selector) as HTMLElement;
    if(dom){
        if(vnode.HasObjAttached()){
            vnode.GetObj().AttachElement(dom);
            vnode.GetObj().onRendered();
        }
        for(let attrname in NO_RENDERED_ATTRS){
            let value=vnode.GetAttr(attrname);
            if(value)
                NO_RENDERED_ATTRS[attrname](dom,value);
        }
    }
    vnode.GetChildren().forEach(child=>{
        if(child instanceof VNode)
            RestoreVNode(child);
    });
}


