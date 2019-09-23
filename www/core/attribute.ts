export const VNODE_ID="__decorator__";
let $isServerRender=false;
export function ServerRender(isServerRender:boolean){
    $isServerRender=isServerRender;
}
const applyAttr:{[name:string]:(elem:HTMLElement,value:any)=>void}={
    "style":(elem,value)=>{
        if(toString.call(value)=="[object Object]"){
            let str="";
            for(let key in value){
                elem.style[key]=value[key];
            }
        }else{
            elem.setAttribute("style",value);
        }
    },
    "className":(elem,value)=>{
        elem.setAttribute("class",value);
    },
    "key":(elem,value)=>{
        return;
    }
};
const serializeAttr:{[name:string]:(value:any)=>string}={
    "style":(value)=>{
        if(toString.call(value)=="[object Object]"){
            let str="";
            for(let key in value){
                str+=`${key}=${value[key]};`;
            }
            return `style="${str}"`;
        }else{
            return "style="+value;
        }
    },
    "className":(value)=>{
        return "class="+value;
    },
    "key":(value)=>{
        return "";
    },
    [VNODE_ID]:(value)=>{
        if($isServerRender)
            return VNODE_ID+"="+value;
        else
            return "";
    }
};
/**toHtml方法使用 */
export function SerializeAttr(name:string,value:any):string{
    if(toString.call(value)=="[object Function]"){
        return "";
    }
    if(serializeAttr[name]){
        return serializeAttr[name](value);
    }else{
        return name+"="+value;
    }
}
/**toDom方法使用 */
export function ApplyAttr(elem:HTMLElement, name:string,value:any){
    if(applyAttr[name]){
        applyAttr[name](elem,value);
    }else{
        elem.setAttribute(name,value);
    }
}

export function GetEventAttrName(attr:string){
    if(/^on([A-Z][a-z]+)+$/.test(attr)){
        return attr.slice(2).toLowerCase();
    }
    return null;
}

