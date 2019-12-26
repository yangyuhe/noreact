import { Diff } from "./diff";
import { RegisterEvent, TriggerEvent } from "./event-center";
import { VNode } from "./VNode";
import React,{ReactCon} from "./react";
import { InsertQueue } from "./refresh";
export abstract class MVVM<T>{
    private $root:VNode;
    private $attachedVNode:VNode;
    /**组件内部的事件注册中心 */
    private $eventRegister:{[event:string]:Function[]}={};
    /**组件的名称，使用@Component装饰器设置该值 */
    public $Name:string;
    /**该组件拥有的子级虚拟树 */
    protected $children:VNode[]=[];
    private $isdirty=false;

    constructor(protected $params:T){
        if($params==null)
            (this.$params as any)={};
        this.$WatchParams(this.$params);
    }
    public $WatchParams(obj){
        if(!obj || typeof(obj)!='object')
            return;
        Object.keys(obj).forEach(key=>{
            let descriptor=Object.getOwnPropertyDescriptor(obj,key);
            if(descriptor && descriptor.configurable){
                let value=obj[key];
                Object.defineProperty(obj,key,{
                    get:()=>{
                        return value;
                    },
                    set:(newval)=>{
                        if(newval!=value){
                            value=newval;
                            this.$isdirty=true;
                            this.$WatchParams(value);
                        }
                    }
                });
                this.$WatchParams(value);
            }
        });
    }
    /**渲染完成后该方法会被调用，此时elem成员变量才可以被访问到 */
    protected $onRendered():void{}
    /**该组建的渲染方法，该方法必须返回一个虚拟树 */
    protected abstract Render():VNode;
    
    /**向所有父级发送消息 */
    protected $emit<Message>(event:string,data:Message){
        this.$root.Emit(event,this,data);
    }
    /**向所有子级发送消息 */
    protected $broadcast<Message>(event:string,data:Message){
        this.$root.BroadCast(event,this,data);
    }
    /**监听事件 */
    protected $on<Message>(event:string,callback:(target:MVVM<any>,data:Message)=>void){
        if(!this.$eventRegister[event])
            this.$eventRegister[event]=[];
        this.$eventRegister[event].push(callback);
        RegisterEvent(event,callback);
    }
    /**发送一个全局事件 */
    protected $notify<Message>(event:string,data:Message){
        TriggerEvent(event,this,data);
    }
    /**触发该组件的某个事件监听 */
    $Trigger(event,...data:any[]){
        let cbs=this.$eventRegister[event];
        if(cbs){
            cbs.forEach(cb=>cb(...data));
        }
    }
    $ToDom():(HTMLElement|Text)[]{
        if(!this.$root)
            this.$DoRender();
        return this.$root.ToDom();
    }
    $ToHtml():string{
        return this.Render().ToHtml();
    }
    $GetRoot(){
        if(!this.$root)
            this.$DoRender();
        return this.$root;
    }
    
    /**设置该组件的子级虚拟树 */
    $SetChildren(children:VNode[]){
        this.$children=children;
    }
    $Dirty(){
        this.$isdirty=true;
        InsertQueue(this);
    }
    $ApplyRefresh(){
        if(this.$isdirty){
            React.ChangeMode("shallow");

            let old=ReactCon.target;
            ReactCon.target=this;
            let newroot=this.Render();
            ReactCon.target=old;

            React.ChangeMode("deep");
            this.$diff([this.$root],[newroot],this.$root.GetParent());
            this.$isdirty=false;
        }
    }
    $DoRender(){
        let keys=[];
        Object.keys(this).forEach(key=>{
            if(!key.startsWith("$"))
                keys.push(key);
        });
        keys.length>0 && this.attachWatcher(this,keys);

        let old=ReactCon.target;
        ReactCon.target=this;
        this.$root=this.Render();
        ReactCon.target=old;
        return this.$root;
    }
    private attachWatcher(obj:Object,keys:string[]){
        if(toString.call(obj)!="[object Object]")
            return;
        let watchers:MVVM<any>[]=[];
        (keys && keys.length>0 && keys || Object.keys(obj)).forEach((key)=>{
            let descriptor=Object.getOwnPropertyDescriptor(obj,key);
            if(descriptor && descriptor.configurable){
                let value=obj[key];
                Object.defineProperty(obj,key,{
                    get:()=>{
                        if(ReactCon.target && watchers.indexOf(ReactCon.target)){
                            watchers.push(ReactCon.target);
                        }
                        return value;
                    },
                    set:(val)=>{
                        if(val!=value){
                            watchers.forEach(item=>item.$Dirty());
                            value=val;
                            this.attachWatcher(value,[]);
                        }
                    },
                    configurable:false,
                    enumerable:true
                });
                this.attachWatcher(value,[]);
            }
        });
    }
    private $diff(olds:VNode[],news:VNode[],parent:VNode){
        let opers=Diff(olds,news,MVVM.$compareVNode);
        opers.reverse();
        let index=0;
        opers.forEach(oper=>{
            if(oper.state=="old"){
                index++;
                if(oper.value.GetType()=="custom"){
                    let instance=oper.value.GetInstance();
                    let dirty=oper.newValue.GetInstance().$isdirty;
                    if(dirty){
                        instance.$params=oper.newValue.GetInstance().$params;
                        instance.$WatchParams(instance.$params);
                        instance.$ApplyRefresh();
                    }else{
                        Object.assign(instance.$params,oper.newValue.GetInstance().$params);
                        if(instance.$isdirty){
                            instance.$params=oper.newValue.GetInstance().$params;
                            instance.$WatchParams(instance.$params);
                            instance.$ApplyRefresh();
                        }
                    }
                    
                    return;
                }
                if(oper.value.GetType()=="standard"){
                    oper.value.ApplyAttrDiff(oper.newValue.GetAttrs());
                    this.$diff(oper.value.GetChildren(),oper.newValue.GetChildren(),oper.value);
                    return;
                }
                if(oper.value.GetType()=="text"){
                    return;
                }
                return;
            }
            if(oper.state=="new"){
                if(oper.value.GetType()=="custom"){
                    oper.value.GetInstance().$DoRender();
                    parent.InsertVNode(oper.value,index);
                }else{
                    parent.InsertVNode(oper.value,index);
                }
                index++;
                return;
            }
            if(oper.state=="delete"){
                parent.RemoveVNode(oper.value);
                return;
            }
            if(oper.state=='replace'){
                parent.RemoveVNode(oper.value);
                if(oper.newValue.GetType()=="custom"){
                    oper.newValue.GetInstance().$DoRender();
                    parent.InsertVNode(oper.newValue,index);
                }else{
                    parent.InsertVNode(oper.newValue,index);
                }
            }
        });
    }
    onRendered(){
        this.$onRendered();
        this.$root.Rendered();
    }
    onDestroyed(){

    }
    $AttachVNode(vnode:VNode){
        this.$attachedVNode=vnode;
    }
    $GetAttachedVNode(){
        return this.$attachedVNode;
    }
    $HasParent(mvvm:MVVM<any>){
        if(!mvvm)
            return false;
        let vnode=this.$attachedVNode;
        while(vnode){
            vnode=vnode.GetParent();
            if(vnode && vnode.GetInstance()==mvvm){
                return true;
            }
        }
        return false;
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
        if(left.GetType()=="standard"){
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
export interface MVVMConstructor<T>{
    new (params:T):MVVM<T>;
}

let reactiveCache:any={};
export function Reactive(proto,propertyName){
    if(!proto.$symbol){
        proto.$symbol=Symbol();
    }
    if(!reactiveCache[proto.$symbol]){
        reactiveCache[proto.$symbol]=[];
    }
    reactiveCache[proto.$symbol].push(propertyName);
}

