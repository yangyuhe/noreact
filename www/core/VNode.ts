import { SerializeAttr, VNODE_ID, ApplyAttr } from "./attribute";
import { BaseComponent } from "./BaseComponent";
import { debug } from "util";

export class VNode{
    /**虚拟节点名称，即标准html的标签名 */
    protected tag:string="";
    /**子节点 */
    protected children:VNode[]=[];
    /**属性集合 */
    private attrs:{name:string,value:any}[]=[];
    /**父节点 */
    private parent:VNode=null;

    /**关联的组件实例，当type='custom'有效 */
    private instance:BaseComponent<any>;
    /**关联的实际dom元素 */
    private dom:HTMLElement|Text;
    /**节点类型 */
    private type:"element"|"text"|"custom";
    /**当时type='text'时这个值才有意义，表示text的内容 */
    private text:string="";


    constructor(type:"element"|"text"|"custom"){
        this.type=type;
    }
    SetTag(tag:string){
        this.tag=tag;
    }
    GetTag(){
        return this.tag;
    }
    SetText(text:string){
        this.text=text;
    }
    GetText(){
        return this.text;
    }
    SetInstance(component:BaseComponent<any>){
        this.instance=component;
    }
    GetInstance(){
        return this.instance;
    }
    GetParent(){
        return this.parent;
    }
    /**在索引为index位置增加一个child */
    AddChild(child:VNode,index:number){
        child.parent=this;
        let dom=child.ToDom();
        if(index==-1){
            this.children.push(child);
            this.dom.appendChild(dom);
        }
        else{
            this.children.splice(index,0,child);
            this.dom.insertBefore(dom,this.dom.childNodes[index]);
        }
        child.Rendered();
    }
    PushChild(child:VNode){
        child.parent=child;
        this.children.push(child);
    }
    RemoveChild(child:VNode){
        let index=this.children.indexOf(child);
        this.children.splice(index,1);
        this.dom.removeChild(child.dom);
    }
    GetChildren(){
        return this.children;
    }
    /**渲染完毕后的回调 */
    Rendered(){
        if(this.type=="custom")
            this.instance.onRendered();
        if(this.type=="element")
            (this.dom as HTMLElement).removeAttribute(VNODE_ID);
        this.children.forEach(child=>{
            child.Rendered();
        });
    }
    GetType(){
        return this.type;
    }
    AddAttr(name:string,value:any){
        this.attrs.push({name,value});
    }
    GetAttrs(){
        return this.attrs;
    }
    GetAttr(name:string){
        for(let i=0;i<this.attrs.length;i++){
            let attr=this.attrs[i];
            if(attr.name==name)
                return attr.value;
        }
        return null;
    }

    ToHtml():string{
        if(this.type=="text")
            return this.text;
        if(this.type=="custom"){
            let vnode=this.instance.GetVNode();
            return vnode.ToHtml();
        }
        if(this.type=="element"){
            let innerhtmls:string[]=[];
        
            innerhtmls.push(`<${this.tag} `);
            
            this.attrs.forEach(attr=>{
                let attrStr=SerializeAttr(attr.name,attr.value);
                if(attrStr)
                    innerhtmls.push(attrStr+" ");
            });
            innerhtmls.push(">");
            this.children.forEach(child=>{
                let res=child.ToHtml();
                innerhtmls.push(res);
            });
            innerhtmls.push(`</${this.tag}>`);
            return innerhtmls.join("");
        }
    }
    ToDom():HTMLElement|Text{
        if(this.type=="custom"){
            let vnode=this.instance.GetVNode();
            let dom=vnode.ToDom();
            this.dom=dom;
            return dom;
        }
        if(this.type=="element"){
            let elem=document.createElement(this.tag);
            this.dom=elem;
            this.attrs.forEach(attr=>{
                ApplyAttr(elem,attr.name,attr.value);
            });
            this.children.forEach(child=>{
                let dom=child.ToDom();
                elem.appendChild(dom);
            });
            return elem;
        }
        if(this.type=="text"){
            let text=document.createTextNode(this.text);
            this.dom=text;
            return text;
        }
    }
    GetDom(){
        return this.dom;
    }


    Emit(event:string,...data:any[]){
        if(this.parent){
            if(this.parent.type=="custom")
                this.parent.instance.Trigger(event,...data);
            this.parent.Emit(event,...data);
        }
    }
    BroadCast(event:string,...data:any[]){
        this.children.forEach(child=>{
            if(child instanceof VNode){
                if(child.type=="custom"){
                    child.instance.Trigger(event,...data);
                }
                child.BroadCast(event,...data);
            }
        });
    }

    Refresh(){
        if(this.type=="custom"){
            this.instance.__refresh();
            return;
        }
        if(this.type=="element"){
            this.children.forEach(child=>{
                child.Refresh();
            });
            return;
        }
    }
    AttachDom(dom:HTMLElement){
        this.dom=dom;
    }
}