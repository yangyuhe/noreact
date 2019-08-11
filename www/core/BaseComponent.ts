import { Diff } from "./diff";
import { RegisterEvent, TriggerEvent } from "./event-center";
import { VNode } from "./VNode";
import React from "./react";
import { PreRefresh } from "./refresh";
export abstract class BaseComponent<T>{
    private root:VNode;
    /**组件内部的事件注册中心 */
    private eventRegister:{[event:string]:Function[]}={};
    /**组件的名称，使用@Component装饰器设置该值 */
    public $Name:string;
    /**该组件拥有的子级虚拟树 */
    protected $children:VNode[]=[];

    constructor(protected $params:T){
        if($params==null)
            (this.$params as any)={};
    }
    /**渲染完成后该方法会被调用，此时elem成员变量才可以被访问到 */
    protected $onRendered():void{}
    /**该组建的渲染方法，该方法必须返回一个虚拟树 */
    protected abstract $Template():VNode;
    private isdirty=false;
    /**向所有父级发送消息 */
    protected $emit<Message>(event:string,data:Message){
        this.root.Emit(event,this,data);
    }
    /**向所有子级发送消息 */
    protected $broadcast<Message>(event:string,data:Message){
        this.root.BroadCast(event,this,data);
    }
    /**监听事件 */
    protected $on<Message>(event:string,callback:(target:BaseComponent<any>,data:Message)=>void){
        if(!this.eventRegister[event])
            this.eventRegister[event]=[];
        this.eventRegister[event].push(callback);
        RegisterEvent(event,callback);
    }
    /**发送一个全局事件 */
    protected $notify<Message>(event:string,data:Message){
        TriggerEvent(event,this,data);
    }
    /**触发该组件的某个事件监听 */
    $Trigger(event,...data:any[]){
        let cbs=this.eventRegister[event];
        if(cbs){
            cbs.forEach(cb=>cb(...data));
        }
    }
    $ToDom():HTMLElement|Text{
        if(!this.root)
            this.$Render();
        return this.root.ToDom();
    }
    $ToHtml():string{
        if(!this.root)
            this.$Render();
        return this.root.ToHtml();
    }
    $GetRoot(){
        if(!this.root)
            this.$Render();
        return this.root;
    }
    
    /**设置该组件的子级虚拟树 */
    $SetChildren(children:VNode[]){
        this.$children=children;
    }
    $Refresh(){
        if(!this.isdirty){
            this.$Dirty();
            PreRefresh(this);
        }
    }
    $Dirty(){
        if(!this.isdirty){
            this.isdirty=true;
            this.root.Dirty();
        }
    }
    $ApplyRefresh(){
        if(this.isdirty){
            React.ChangeMode("shallow");
            let newroot=this.$Template();
            React.ChangeMode("deep");
            this.diff([this.root],[newroot],this.root.GetParent());
            this.isdirty=false;
        }else{
            this.root.ApplyRefresh()
        }
    }
    $Render(){
        this.root=this.$Template();
        return this.root;
    }
    private diff(olds:VNode[],news:VNode[],parent:VNode){
        let opers=Diff(olds,news,BaseComponent.$compareVNode);
        opers.reverse();
        let index=0;
        opers.forEach(oper=>{
            if(oper.state=="old"){
                index++;
                if(oper.value.GetType()=="custom"){
                    let instance=oper.value.GetInstance();
                    instance.$params=oper.newValue.GetInstance().$params;
                    instance.$ApplyRefresh();
                    return;
                }
                if(oper.value.GetType()=="element"){
                    oper.value.ApplyAttrDiff(oper.newValue.GetAttrs());
                    this.diff(oper.value.GetChildren(),oper.newValue.GetChildren(),oper.value);
                    return;
                }
                if(oper.value.GetType()=="text"){
                    return;
                }
                return;
            }
            if(oper.state=="new"){
                if(oper.value.GetType()=="custom"){
                    let vnode=oper.value.GetInstance().$Render();
                    oper.value.AppendVChild(vnode);
                    parent.InsertChild(oper.value,index);
                }else{
                    parent.InsertChild(oper.value,index);
                }
                index++;
                return;
            }
            if(oper.state=="delete"){
                parent.RemoveVChild(oper.value);
                return;
            }
        });
    }
    $Rendered(){
        this.$onRendered();
        this.root.Rendered();
    }
    static $compareVNode(left:VNode,rigth:VNode){
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