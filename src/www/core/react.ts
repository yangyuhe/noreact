import { VNode as VNode } from "./VNode";
import { ComponentConstructor } from "./BaseComponent";
import { VNODE_ID } from "./const";
import { ComponentName } from "./component-manager";
import { GetModuleCustomeInfo } from "./custominfo-manager";

class React{
    private counter=0;
    ResetCounter(){
        this.counter=0;
    }
    createElement(Elem:string|ComponentConstructor<any>,attrs:{[key:string]:any},...children:(VNode|VNode[]|string)[]) :VNode{
        let allchildren:(VNode|string)[]=[];
        children.forEach(child=>{
            if(child instanceof Array){
                child.forEach(c=>{
                    allchildren.push(c);
                });
                return;
            }
            if(typeof(child)=="string"){
                allchildren.push(child);
                return;
            }
            if(child instanceof VNode){
                allchildren.push(child);
                return;
            }
        });

        let vnode:VNode;
        if(typeof Elem=="string"){
            vnode=new VNode(Elem);
            vnode.AddAttr(VNODE_ID,this.counter);
            this.counter++;
            if(attrs!=null){
                for(let key in attrs){
                    vnode.AddAttr(key,attrs[key]);
                }
            }
            allchildren.forEach(child=>{
                if(Elem=="span"){
                    console.log(Elem);
                }
                vnode.AddChild(child);
                if(child instanceof VNode){
                    child.SetParent(vnode);
                }
            });
        }
        else{
            let name=ComponentName(Elem);
            if(name){
                let info=GetModuleCustomeInfo(name);
                if(info){
                    Object.assign(attrs,info);
                }    
            }
            

            let elem=new Elem(attrs);
            elem.SetChildren(allchildren);
            vnode=elem.GetVNode();
            vnode.SetObj(elem);
        }
        
        return vnode;
    }
    
}
export default new React();

