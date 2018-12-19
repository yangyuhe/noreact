import { ComponentConstructor, BaseComponent } from "./BaseComponent";

export function Style(style:string){
    return function(CONS:any){
        styleSet.push({CONS:CONS,style:style});
        return CONS;
    }
}

let styleSet:{CONS:ComponentConstructor<any>,style:string}[]=[];

export function GetStyle(instance:BaseComponent<any>){
    for(let i=0;i<styleSet.length;i++){
        if(styleSet[i].CONS==instance.constructor){
            return styleSet[i].style;
        }
    }
    return null;
}
