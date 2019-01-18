import { Diff } from "./diff";
import { RegisterEvent, TriggerEvent } from "./event-center";
import { VNode } from "./VNode";
export abstract class BaseComponent<T>{
    private vnode:VNode;
    /**组件内部的事件注册中心 */
    private eventRegister:{[event:string]:Function[]}={};
    /**组件的名称，使用@Component装饰器设置该值 */
    public Name:string;
    /**该组件拥有的子级虚拟树 */
    protected children:VNode[]=[];

    constructor(protected params:T){
        if(params==null)
            (this.params as any)={};
    }
    /**渲染完成后该方法会被调用，此时elem成员变量才可以被访问到 */
    onRendered():void{}
    /**该组建的渲染方法，该方法必须返回一个虚拟树 */
    protected abstract Render():VNode;
    private isdirty=false;
    /**向所有父级发送消息 */
    protected emit<Message>(event:string,data:Message){
        this.vnode.Emit(event,this,data);
    }
    /**向所有子级发送消息 */
    protected broadcast<Message>(event:string,data:Message){
        this.vnode.BroadCast(event,this,data);
    }
    /**监听事件 */
    protected on<Message>(event:string,callback:(target:BaseComponent<any>,data:Message)=>void){
        if(!this.eventRegister[event])
            this.eventRegister[event]=[];
        this.eventRegister[event].push(callback);
        RegisterEvent(event,callback);
    }
    /**发送一个全局事件 */
    protected notify<Message>(event:string,data:Message){
        TriggerEvent(event,this,data);
    }
    /**出发该组件的某个事件监听 */
    Trigger(event,...data:any[]){
        let cbs=this.eventRegister[event];
        if(cbs){
            cbs.forEach(cb=>cb(...data));
        }
    }
    /**获取该组件的虚拟树 */
    GetVNode():VNode{
        if(!this.vnode){
            this.vnode=new VNode("custom");
            this.vnode.SetInstance(this);

            let child=this.Render();
            this.vnode.PushChild(child);
        }else{
            if(this.vnode.GetChildren().length==0){
                let child=this.Render();
                this.vnode.PushChild(child);
            }
        }
        
        return this.vnode.GetChildren()[0];
    }
    
    /**设置该组件的子级虚拟树 */
    SetChildren(children:VNode[]){
        this.children=children;
    }
    SetVNode(vnode:VNode){
        this.vnode=vnode;
    }
    Refresh(){
        this.isdirty=true;
        this.vnode.Refresh();
    }
    __refresh(){
        
        let newroot=this.Render();
        let oldroot=this.vnode.GetChildren();
        this.apply(oldroot,[newroot],this.vnode);
        
    }
    private apply(olds:VNode[],news:VNode[],parent:VNode){
        let opers=Diff(olds,news,BaseComponent.compareVNode);
        opers.reverse();
        let index=0;
        opers.forEach(oper=>{
            if(oper.state=="old"){
                index++;
                if(oper.value.GetType()=="custom"){
                    let instance=oper.value.GetInstance();
                    instance.params=oper.newValue.GetInstance().params;
                    instance.__refresh();
                    return;
                }
                if(oper.value.GetType()=="element"){
                    this.apply(oper.value.GetChildren(),oper.newValue.GetChildren(),oper.value);
                    return;
                }
                if(oper.value.GetType()=="text"){
                    return;
                }
                return;
            }
            if(oper.state=="new"){
                parent.AddChild(oper.value,index);
                index++;
                return;
            }
            if(oper.state=="delete"){
                parent.RemoveChild(oper.value);
                return;
            }
        });
    }
    static compareVNode(left:VNode,rigth:VNode){
        if(left.GetAttr("key")!=rigth.GetAttr("key")){
            return false;
        }
        if(left.GetType()!=rigth.GetType()){
            return false;
        }
        if(left.GetType()=="custom"){
            if(left.GetInstance().constructor!=rigth.GetInstance().constructor){
                return false;
            }
        }
        if(left.GetType()=="element"){
            if(left.GetTag()!=rigth.GetTag())
                return false;
        }
        if(left.GetType()=="text"){
            if(left.GetText()!=rigth.GetText())
                return false;
        }
        return true;
    }
}
export interface ComponentConstructor<T>{
    new (params:T):BaseComponent<T>;
}