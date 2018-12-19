export const NO_RENDERED_ATTRS:{[name:string]:(elem:HTMLElement,value:any)=>void}={
    "onClick":(elem,value)=>{
        elem.addEventListener("click",value);
    }
};
export const TRANSFER_ATTRS:{[name:string]:string}={
    "className":"class"
};


export const VNODE_ID="__decorator__";