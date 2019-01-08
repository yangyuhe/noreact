import { BaseComponent } from "./core/BaseComponent";
import { NO_RENDERED_ATTRS, VNODE_ID } from "./core/const";
import { VNode } from "./core/VNode";
import { GetJSModule } from "./dynamic-require";

/**@import "./assets/css/common.scss" */
declare let $noreact_roots:{name:string,data:any}[];
if($noreact_roots){
    $noreact_roots.forEach(root=>{
        let promise=GetJSModule(root.name);
        if(promise)
            promise.then(module=>{
                let component:BaseComponent<any>=new module(root.data);
                let tree=component.GetVNode();
                tree.SetObj(component);
                RestoreVNode(tree,null);
            });
    });
}

// let ws=new WebSocket("ws://localhost:8002/noreact-tool");
// ws.onmessage=msg=>{
//     if(msg.data=="refresh"){
//         window.location.reload();
//     }
// };

function RestoreVNode(vnode:VNode,elem:HTMLElement){
    let nodeId=vnode.GetAttr(VNODE_ID);
    let selector=`[${VNODE_ID}='${nodeId}']`;

    let dom=(elem || document).querySelector(selector) as HTMLElement;
    if(dom){
        dom.removeAttribute(VNODE_ID);
        if(vnode.HasObjAttached()){
            vnode.GetObj().AttachElement(dom);
            vnode.GetObj().onRendered();
        }
        for(let attrname in NO_RENDERED_ATTRS){
            let value=vnode.GetAttr(attrname);
            if(value)
                NO_RENDERED_ATTRS[attrname](dom,value);
        }
        vnode.GetChildren().forEach(child=>{
            if(child instanceof VNode)
                RestoreVNode(child,dom);
        });
    }
}


