import { VNode } from "./VNode";
import { ComponentConstructor } from "./BaseComponent";
import { VNODE_ID } from "./const";

class React{
    private counter=0;
    ResetCounter(){
        this.counter=0;
    }
    createElement(Elem:string|ComponentConstructor<any>,attrs:{[key:string]:any},...children:(VNode|VNode[]|string)[]) :VNode{
        
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
        }
        else{
            let elem=new Elem(attrs);
            vnode=elem.GetVNode();
            vnode.SetObj(elem);
        }
        
        children.forEach(child=>{
            if(child instanceof Array){
                child.forEach(c=>{
                    vnode.AddChild(c);
                    c.SetParent(vnode);
                });
                return;
            }
            if(typeof(child)=="string"){
                vnode.AddChild(child);
                return;
            }
            
            if(child instanceof VNode){
                vnode.AddChild(child);
                child.SetParent(vnode);
                return;
            }
            try{
                vnode.AddChild(JSON.stringify(child));
            }catch(err){
                console.error(err);
            }
            
        });
        
        return vnode;
    }
    
}
export default new React();

