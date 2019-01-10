let cache:{[module:string]:any}={};
export function GetModuleCustomeInfo(module:string){
    return cache[module];
}
export function SaveModuleCustomInfo(module:string,info:any){
    cache[module]=info;
}