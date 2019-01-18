import { VNode } from "./VNode";
import { ComponentConstructor } from "./BaseComponent";
import { VNODE_ID } from "./attribute";

class React{
    private counter=0;
    ResetCounter(){
        this.counter=0;
    }
    private addToChild(child:VNode|any,index:string,children:VNode[]){
        if(child instanceof VNode){
            child.AddAttr("key",index);
            children.push(child);
            return;
        }else{
            let vnode=new VNode("text");
            vnode.AddAttr("key",index);
            let json=child+"";
            vnode.SetText(json);
            children.push(vnode);
            return;
        }
    }
    createElement(Elem:string|ComponentConstructor<any>,attrs:{[key:string]:any},...children:(VNode|VNode[]|string)[]) :VNode{
        let allchildren:VNode[]=[];
        children.forEach((child,index)=>{
            if(child instanceof Array){
                child.forEach((c,subindex)=>{
                    let key=c.GetAttr("key");
                    if(key!=null)
                        this.addToChild(c,index+"-"+key,allchildren);
                    else
                        this.addToChild(c,index+"-"+subindex,allchildren);
                });
            }else{
                this.addToChild(child,index+"",allchildren);
            }
        });
        
        
        if(typeof Elem=="string"){
            let vnode:VNode=new VNode("element");
            vnode.SetTag(Elem);
            vnode.AddAttr(VNODE_ID,this.counter);
            this.counter++;
            if(attrs!=null){
                for(let key in attrs){
                    vnode.AddAttr(key,attrs[key]);
                }
            }
            allchildren.forEach(child=>{
                vnode.PushChild(child);
            });
            return vnode;
        }
        else{
            let mvvm=new Elem(attrs);
            mvvm.SetChildren(allchildren);
            let vnode=new VNode("custom");
            if(attrs!=null){
                for(let key in attrs){
                    vnode.AddAttr(key,attrs[key]);
                }
            }
            vnode.SetInstance(mvvm);
            mvvm.SetVNode(vnode);
            return vnode;
        }
    }
    
}
export default new React();

