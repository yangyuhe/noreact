import { VNode } from "./VNode";
import { MVVMConstructor, MVVM } from "./MVVM";
import { VNODE_ID } from "./attribute";

const isInBrowser=new Function("try {return this===window;}catch(e){ return false;}");
export class ReactCon{
    private counter=0;
    private mode:"deep"|"shallow"="deep";
    public static target:MVVM<any>;
    ResetCounter(){
        this.counter=0;
    }
    createElement(Elem:string|MVVMConstructor<any>,attrs:{[key:string]:any},...children:(VNode|VNode[]|string)[]) :VNode{
        let allchildren:VNode[]=[];
        this.flatten("",children,allchildren);
        
        if(typeof Elem=="string"){
            let vnode:VNode=new VNode("standard");
            vnode.SetTag(Elem);
            if(!isInBrowser()){
                vnode.SetAttr(VNODE_ID,this.counter);
                this.counter++;
            }
            
            if(attrs!=null){
                for(let key in attrs){
                    vnode.SetAttr(key,attrs[key]);
                }
            }
            allchildren.forEach(child=>{
                vnode.AppendChild(child);
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
                mvvm.$DoRender();
            }

            if(attrs!=null){
                for(let key in attrs){
                    vnode.SetAttr(key,attrs[key]);
                }
            }
            return vnode;
        }
    }

    private flatten(prefix:string,children:any[],res:VNode[]){
        children.forEach((child,index)=>{
            if(child==null)
                return;
            if(child instanceof Array){
                this.flatten(prefix+index+"_",child,res);
            }else{
                if(child instanceof VNode){
                    let key=child.GetAttr("key");
                    if(key){
                        res.push(child);
                    }else{
                        child.SetAttr("key",prefix+index);
                        res.push(child);
                    }
                }else{
                    let textnode=new VNode("text");
                    textnode.SetText(child+"");
                    textnode.SetAttr("key",prefix+index);
                    res.push(textnode);
                }
            }
        });
    }
    ChangeMode(mode:"shallow"|"deep"){
        this.mode=mode;
    }
}
export default new ReactCon();

