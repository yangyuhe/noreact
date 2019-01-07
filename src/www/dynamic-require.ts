import { BaseComponent, ComponentConstructor } from "./core/BaseComponent";

export function GetJSModule(module:string){
        let promise:Promise<ComponentConstructor<any>>;
        if(module=="about-page"){
            promise=import(/*webpackChunkName:"homepage" */"./pages/About").then(module=>{
                return module.AboutPage;
            });
        }
        if(module=="md-fact"){
            promise=import(/*webpackChunkName:"md-fact" */"./components/fact/fact").then(module=>{
                return module.MdFact;
            });
        }
        if(!promise)
            throw new Error("no specified module found:"+module);
        return promise;
}

