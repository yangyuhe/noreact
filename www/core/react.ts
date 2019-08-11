import { VNode } from "./VNode";
import { ComponentConstructor, BaseComponent } from "./BaseComponent";
import { VNODE_ID } from "./attribute";

const isInBrowser=new Function("try {return this===window;}catch(e){ return false;}");
class React{
    private counter=0;
    private mode:"deep"|"shallow"="deep";
    ResetCounter(){
        this.counter=0;
    }
    createElement(Elem:string|ComponentConstructor<any>,attrs:{[key:string]:any},...children:(VNode|VNode[]|string)[]) :VNode{
        let allchildren:VNode[]=[];
        children.forEach((child,index)=>{
            if(child instanceof Array){
                child.forEach((c,subindex)=>{
                    let key=c.GetAttr("key");
                    if(key!=null)
                        allchildren.push(c);
                    else{
                        c.SetAttr("key",index+"-"+subindex);
                        allchildren.push(c);
                    }
                });
                return;
            }
            if(child instanceof VNode){
                child.SetAttr("key",index);
                allchildren.push(child);
                return;
            }
            
            let textnode=new VNode("text");
            textnode.SetText(child+"");
            textnode.SetAttr("key",index);
            allchildren.push(textnode);
        });
        
        if(typeof Elem=="string"){
            let vnode:VNode=new VNode("element");
            vnode.SetTag(Elem);
            if(!isInBrowser()){
                vnode.SetAttr(VNODE_ID,this.counter);
                this.counter++;
            }
            
            if(attrs!=null){
                for(let key in attrs){
                    if(toString.call(attrs[key])=="[object Object]" && key=="style"){
                        vnode.SetAttr("style",JSON.parse(JSON.stringify(attrs[key])));
                    }else{
                        vnode.SetAttr(key,attrs[key]);
                    }
                }
            }
            allchildren.forEach(child=>{
                vnode.AppendVChild(child);
            });
            return vnode;
        }
        else{
            let vnode=new VNode("custom");
            if(!isInBrowser()){
                vnode.SetAttr(VNODE_ID,this.counter);
                this.counter++;
            }
            
            let mvvm=new Elem(attrs);
            vnode.SetInstance(mvvm);
            mvvm.$SetChildren(allchildren);
            mvvm.$AttachVNode(vnode);
            if(this.mode=="deep"){
                let child=mvvm.$Render();
                vnode.AppendVChild(child);
            }

            if(attrs!=null){
                for(let key in attrs){
                    vnode.SetAttr(key,attrs[key]);
                }
            }
            
            return vnode;
        }
    }
    ChangeMode(mode:"shallow"|"deep"){
        this.mode=mode;
    }
}
export default new React();

