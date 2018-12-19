import { HomePage, HomePageParams } from "./pages/HomeV1";
import { NO_RENDERED_ATTRS, VNODE_ID } from "../www/core/const";
import { VNode } from "../www/core/VNode";

declare let __origin__:HomePageParams;

if(__origin__){
    let homepage=new HomePage(__origin__);
    let tree=homepage.GetVNode();
    tree.SetObj(homepage);
    RestoreVNode(tree);
}

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
            NO_RENDERED_ATTRS[attrname](dom,value);
        }
    }
    vnode.GetChildren().forEach(child=>{
        if(child instanceof VNode)
            RestoreVNode(child);
    });
}
