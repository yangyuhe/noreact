import { ComponentConstructor } from "./BaseComponent";

let componentSet:{[key:string]:ComponentConstructor<any>}={};

/**
 * 给一个组件起个名字，这个装饰器不是必须的，当该组件参与动态构建见面时才是必须的
 * @param name 
 */
export function Component(info:{name:string,style?:string}){
    return function(component:any){
        if(componentSet[info.name]){
            throw new Error("component name ["+name+"] duplicated");
        }
        componentSet[info.name]=component;
        return <any>class extends component{
            $Name:string=info.name;
        };
    };
}

/**
 * 根据组件名和数据返回一个组件实例
 * @param name 
 * @param data 
 */
export function ComponentFactory(name:string,data:any){
    let factory=componentSet[name];
    if(factory)
        return new factory(data);
    return null;
}
/**
 * 判断是否有这个组件存在
 * @param name 组件名
 */
export function ComponentExist(name:string):boolean{
    return componentSet[name]!=null;
}
/**
 * 获取组件名
 */
export function ComponentName(cons:ComponentConstructor<any>):string{
    for(let key in componentSet){
        if(componentSet[key]==cons){
            return key;
        }
    }
    return null;
}