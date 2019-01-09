export const CONTEXT_ATTRS:{[name:string]:(elem:HTMLElement,value:any)=>void}={
    "onClick":(elem,value)=>{
        elem.addEventListener("click",value);
    },
    "onMouseOver":(elem,value)=>{
        elem.addEventListener("mouseover",value);
    },
    "style":(elem,value)=>{
        for(let key in value){
            elem.style[key]=value[key];
        }
    }
};
export const VARIABLE_ATTRS:{[name:string]:string}={
    "className":"class"
}; 

export const VNODE_ID="__decorator__";