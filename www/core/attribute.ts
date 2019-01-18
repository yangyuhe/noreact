export const EVENT_ATTRS:{[name:string]:(elem:HTMLElement,value:any)=>void}={
    "onClick":(elem,value)=>{
        elem.addEventListener("click",value);
    },
    "onMouseOver":(elem,value)=>{
        elem.addEventListener("mouseover",value);
    }
};
export function SerializeAttr(name:string,value:any):string{
    if(name=="style" && toString.call(value)=="[object Object]"){
        let str="";
        for(let key in value){
            str+=`${key}=${value[key]};`;
        }
        return `style="${str}"`;
    }
    let type=toString.call(value);
    let allowed=["[object Boolean]","[object Number]","[object String]"];
    if(allowed.indexOf(type)!=-1){
        if(name=="className"){
            name="class";
        }
        return `${name}="${value}"`;
    }
    return "";
}
export function ApplyAttr(elem:HTMLElement, name:string,value:any){
    if(name=="style" && toString.call(value)=="[object Object]"){
        let str="";
        for(let key in value){
            elem.style[key]=value[key];
        }
        return;
    }
    let type=toString.call(value);
    let allowed=["[object Boolean]","[object Number]","[object String]"];
    if(allowed.indexOf(type)!=-1){
        if(name=="className"){
            name="class";
        }
        elem.setAttribute(name,value);
        return;
    }
    if(EVENT_ATTRS[name]){
        EVENT_ATTRS[name](elem,value);
        return;
    }
}

export const VNODE_ID="__decorator__";