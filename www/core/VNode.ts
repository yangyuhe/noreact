import { BaseComponent } from "./BaseComponent";
import { CONTEXT_ATTRS, VARIABLE_ATTRS, VNODE_ID } from "./const";

export class VNode{
    protected name:string="";
    
    protected children:(VNode|string)[]=[];
    private attrs:{name:string,value:any}[]=[];
    private parent:VNode=null;

    private mvvm:BaseComponent<any>;

    private dom:HTMLElement;
    
    constructor(name:string){
        this.name=name;
    }
    
    AddChild(child:VNode|string){
        this.children.push(child);
    }
    GetChildren(){
        return this.children;
    }
    Rendered(){
        this.dom.removeAttribute(VNODE_ID);
        this.children.forEach(child=>{
            if(child instanceof VNode){
                if(child.HasMvvmAttached())
                    child.GetMvvm().Rendered();
                else{
                    child.Rendered();
                }
            }
        });
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
        console.log(this.name);
        if(this.name=="span"){
            console.log(this.name);
        }
        let innerhtmls:string[]=[];
        
        innerhtmls.push(`<${this.name} `);
        
        this.attrs.forEach(attr=>{
            if(CONTEXT_ATTRS[attr.name]==null){
                let transferdName=VARIABLE_ATTRS[attr.name];
                if(transferdName)
                    innerhtmls.push(`${transferdName}="${attr.value}" `);
                else
                    innerhtmls.push(`${attr.name}="${attr.value}" `);
            }
        });
        innerhtmls.push(">");
        this.children.forEach(child=>{
            if(child=="span" ){
                console.log("span");
            }
            if(child instanceof VNode){
                let res=child.ToHtml();
                innerhtmls.push(res);
                return;
            }
            if(typeof(child)=="string"){
                innerhtmls.push(child);
                return;
            }
        });
        innerhtmls.push(`</${this.name}>`);
        return innerhtmls.join("");
    }
    ToDom():HTMLElement{
        let elem=document.createElement(this.name);
        
        this.attrs.forEach(attr=>{
            if(CONTEXT_ATTRS[attr.name]!=null){
                CONTEXT_ATTRS[attr.name](elem,attr.value);
                return;
            }
            if(VARIABLE_ATTRS[attr.name]!=null){
                let transferdName=VARIABLE_ATTRS[attr.name];
                elem.setAttribute(transferdName,attr.value);
                return;
            }
            elem.setAttribute(attr.name,attr.value);
        });
        this.children.forEach(child=>{
            if(child instanceof VNode){
                let dom=child.ToDom();
                elem.appendChild(dom);
                return;
            }
            if(typeof(child)=="string"){
                let textnode=document.createTextNode(child);
                elem.appendChild(textnode);
                return;
            }
        });
        if(this.mvvm)
            this.mvvm.AttachElement(elem);
        this.dom=elem;
        return elem;
    }
    

    SetMvvm(obj:BaseComponent<any>){
        this.mvvm=obj;
    }
    GetMvvm(){
        return this.mvvm;
    }
    HasMvvmAttached(){
        return this.mvvm!=null;
    }

    Emit(event:string,...data:any[]){
        if(this.parent){
            if(this.parent.HasMvvmAttached())
                this.parent.GetMvvm().__Trigger(event,...data);
            this.parent.Emit(event,...data);
        }
    }
    BroadCast(event:string,...data:any[]){
        this.children.forEach(child=>{
            if(child instanceof VNode){
                let obj=child.GetMvvm();
                if(obj){
                    obj.__Trigger(event,...data);
                }
                child.BroadCast(event,...data);
            }
        });
    }

    SetParent(parent:VNode){
        this.parent=parent;
    }
    GetChild(name:string):VNode{
        for(let i=0;i<this.children.length;i++){
            let child=this.children[i];
            if(child instanceof VNode){
                if(child.name==name)
                    return child;
                else{
                    let res=child.GetChild(name);
                    if(res)
                        return res;
                }
            }

        }
        return null;
    }
}