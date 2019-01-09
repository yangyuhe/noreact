import { VNode } from "./VNode";
import $ from "jquery";
import { RegisterEvent, TriggerEvent } from "./event-center";
export abstract class BaseComponent<T>{
    private root:VNode;
    protected $elem:JQuery;
    protected elem:HTMLElement;
    private eventRegister:{[event:string]:Function[]}={};
    public Name:string;
    protected children:(VNode|string)[]=[];
    constructor(protected params:T){
        if(!params)
            (this.params as any)={};
    }
    abstract onRendered():void;
    protected abstract Render():VNode;
    
    protected emit(event:string,...data:any[]){
        this.root.Emit(event,this,...data);
    }
    protected broadcast(event:string,...data:any[]){
        this.root.BroadCast(event,this,...data);
    }
    protected on(event:string,callback:(target:BaseComponent<any>,...data:any[])=>void){
        if(!this.eventRegister[event])
            this.eventRegister[event]=[];
        this.eventRegister[event].push(callback);
        RegisterEvent(event,callback);
    }
    protected notify(event:string,...data:any[]){
        TriggerEvent(event,this,...data);
    }
    __Trigger(event,...data:any[]){
        let cbs=this.eventRegister[event];
        if(cbs){
            cbs.forEach(cb=>cb(...data));
        }
    }
    GetVNode():VNode{
        if(!this.root)
            this.root=this.Render();
        return this.root;
    }
    ToHtml(withjs:boolean=false){
        let vnode=this.GetVNode();
        if(withjs){
            vnode.AddChild(``)
        }
        return vnode.ToHtml();
    }
    // 
    ToDom(){
        let vnode=this.GetVNode();
        return vnode.ToDom();
    }
    // 赋值elems
    AttachElement(elem:HTMLElement){
        this.elem=elem;
        this.$elem=$(elem);
    }
    GetChild(){
        return this.root.GetChildren();
    }
    SetChildren(children:(VNode|string)[]){
        this.children=children;
    }
}
export interface ComponentConstructor<T>{
    new (params:T):BaseComponent<T>;
}