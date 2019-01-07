import { BaseComponent } from "./BaseComponent";
import { NO_RENDERED_ATTRS, TRANSFER_ATTRS } from "./const";

export class JSX{
    protected name:string="";
    
    protected children:(JSX|string)[]=[];
    private attrs:{name:string,value:any}[]=[];
    private parent:JSX=null;

    private obj:BaseComponent<any>;
    
    constructor(name:string){
        this.name=name;
    }
    
    AddChild(child:JSX|string){
        this.children.push(child);
    }
    GetChildren(){
        return this.children;
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
        let innerhtmls:string[]=[];
        
        innerhtmls.push(`<${this.name} `);
        
        this.attrs.forEach(attr=>{
            if(NO_RENDERED_ATTRS[attr.name]==null){
                let transferdName=TRANSFER_ATTRS[attr.name];
                if(transferdName)
                    innerhtmls.push(`${transferdName}="${attr.value}" `);
                else
                    innerhtmls.push(`${attr.name}="${attr.value}" `);
            }
        });
        innerhtmls.push(">");
        this.children.forEach(child=>{
            if(child instanceof JSX){
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
            if(attr.name=="onClick"){
                elem.addEventListener("click",attr.value);
            }else{
                elem.setAttribute(attr.name,attr.value);
            }
        });
        this.children.forEach(child=>{
            if(child instanceof JSX){
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
        return elem;
    }
    

    SetObj(obj:BaseComponent<any>){
        this.obj=obj;
    }
    GetObj(){
        return this.obj;
    }
    HasObjAttached(){
        return this.obj!=null;
    }

    Emit(event:string,...data:any[]){
        if(this.parent){
            if(this.parent.HasObjAttached())
                this.parent.GetObj().Trigger(event,...data);
            this.parent.Emit(event,...data);
        }
    }
    BroadCast(event:string,...data:any[]){
        this.children.forEach(child=>{
            if(child instanceof JSX){
                let obj=child.GetObj();
                if(obj){
                    obj.Trigger(event,...data);
                }
                child.BroadCast(event,...data);
            }
        });
    }

    SetParent(parent:JSX){
        this.parent=parent;
    }
    GetChild(name:string):JSX{
        for(let i=0;i<this.children.length;i++){
            let child=this.children[i];
            if(child instanceof JSX){
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